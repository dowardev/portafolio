<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class HomePageController extends Controller
{
    private function getAllCurrentImageUrls(HomePage $homepage): array
    {
        $urls = [];

        if ($homepage->logo_url) {
            $urls[] = $this->pathFromUrl($homepage->logo_url);
        }
        if ($homepage->photo_url) {
            $urls[] = $this->pathFromUrl($homepage->photo_url);
        }

        foreach ($homepage->stack ?? [] as $item) {
            if (!empty($item['image'])) {
                $urls[] = $this->pathFromUrl($item['image']);
            }
        }

        foreach ($homepage->experience ?? [] as $exp) {
            if (!empty($exp['img'])) {
                $urls[] = $this->pathFromUrl($exp['img']);
            }
            foreach ($exp['technologies'] ?? [] as $tech) {
                if (!empty($tech['source'])) {
                    $urls[] = $this->pathFromUrl($tech['source']);
                }
            }
        }

        foreach ($homepage->projects ?? [] as $project) {
            if (!empty($project['img'])) {
                $urls[] = $this->pathFromUrl($project['img']);
            }
            if (!empty($project['source']['img'])) {
                $urls[] = $this->pathFromUrl($project['source']['img']);
            }
            foreach ($project['technologies'] ?? [] as $tech) {
                if (!empty($tech['source'])) {
                    $urls[] = $this->pathFromUrl($tech['source']);
                }
            }
        }

        foreach ($homepage->certificates ?? [] as $cert) {
            if (!empty($cert['img'])) {
                $urls[] = $this->pathFromUrl($cert['img']);
            }
            foreach ($cert['aptitudes'] ?? [] as $apt) {
                if (!empty($apt['source'])) {
                    $urls[] = $this->pathFromUrl($apt['source']);
                }
            }
        }

        foreach ($homepage->freelance ?? [] as $platform) {
            if (!empty($platform['image'])) {
                $urls[] = $this->pathFromUrl($platform['image']);
            }
            foreach ($platform['comments'] ?? [] as $comment) {
                if (!empty($comment['image'])) {
                    $urls[] = $this->pathFromUrl($comment['image']);
                }
            }
        }

        return array_filter($urls);
    }

    private function deleteOldImages(array $currentUrls, array $newUrls): void
    {
        $toDelete = array_diff($currentUrls, $newUrls);

        foreach ($toDelete as $url) {
            $path = $this->pathFromUrl($url);
            if ($path) {
                \Log::info("Attempting to delete image: " . $path);
                \Log::info("Exists: " . (Storage::disk('public')->exists($path) ? 'yes' : 'no'));
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                    \Log::info("Deleted: " . $path);
                }
            }
        }
    }

    private function pathFromUrl(string $url): string
    {
        // Handle URLs like "http://localhost:8000/storage/homepage/..." or "http://localhost/storage/homepage/..."
        if (preg_match('#^https?://[^/]+/storage/(.+)$#', $url, $matches)) {
            return $matches[1];
        }
        
        // Handle URLs like "http://localhost:8000/storage/homepage/..." where asset('') returns "http://localhost:8000/"
        $assetUrl = rtrim(asset(''), '/');
        if ($assetUrl && str_starts_with($url, $assetUrl)) {
            $path = ltrim(str_replace($assetUrl, '', $url), '/');
            if (str_starts_with($path, 'storage/')) {
                $path = substr($path, 8);
            }
            return $path;
        }
        
        // Handle absolute URLs without scheme
        if (preg_match('#^//[^/]+/storage/(.+)$#', $url, $matches)) {
            return $matches[1];
        }
        
        // Handle URLs already in relative form like "storage/homepage/..."
        if (str_starts_with($url, 'storage/')) {
            return substr($url, 8);
        }
        
        // Handle clean relative paths like "homepage/..."
        return ltrim(str_replace(asset(''), '', $url), '/');
    }

public function getProjects()
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);
        return response()->json(['projects' => $homepage->projects ?? []]);
    }

    public function getExperiences()
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['experience' => []]);
        return response()->json(['experience' => $homepage->experience ?? []]);
    }

    public function getFreelance()
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['freelance' => []]);
        return response()->json(['freelance' => $homepage->freelance ?? []]);
    }

    public function updateProjects(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);

        $currentImageUrls = [];
        foreach ($homepage->projects ?? [] as $project) {
            if (!empty($project['img'])) {
                $currentImageUrls[] = $this->pathFromUrl($project['img']);
            }
        }

        $projects = $request->input('projects', []);
        if (is_string($projects)) {
            $projects = json_decode($projects, true) ?? [];
        }

        foreach ($projects as $index => &$project) {
            $fileKey = "project_image_{$index}";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
                $project['img'] = asset('storage/homepage/projects/' . $fileName);
            }
            $sourceFileKey = "project_source_image_{$index}";
            if ($request->hasFile($sourceFileKey)) {
                $file = $request->file($sourceFileKey);
                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->put('homepage/projects/source/' . $fileName, file_get_contents($file));
                $project['source']['img'] = asset('storage/homepage/projects/source/' . $fileName);
            }
        }

        $homepage->projects = $projects;
        $homepage->save();

        $newImageUrls = [];
        foreach ($projects as $project) {
            if (!empty($project['img'])) {
                $newImageUrls[] = $this->pathFromUrl($project['img']);
            }
        }
        $this->deleteOldImages($currentImageUrls, $newImageUrls);

        return response()->json(['projects' => $homepage->projects]);
    }

    public function updateExperiences(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['experience' => []]);

        $currentImageUrls = [];
        foreach ($homepage->experience ?? [] as $exp) {
            if (!empty($exp['img'])) {
                $currentImageUrls[] = $this->pathFromUrl($exp['img']);
            }
        }

        $experience = $request->input('experience', []);
        if (is_string($experience)) {
            $experience = json_decode($experience, true) ?? [];
        }

        foreach ($experience as $index => &$exp) {
            $fileKey = "exp_image_{$index}";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
                $exp['img'] = asset('storage/homepage/experience/' . $fileName);
            }
        }

        $homepage->experience = $experience;
        $homepage->save();

        $newImageUrls = [];
        foreach ($experience as $exp) {
            if (!empty($exp['img'])) {
                $newImageUrls[] = $this->pathFromUrl($exp['img']);
            }
        }
        $this->deleteOldImages($currentImageUrls, $newImageUrls);

        return response()->json(['experience' => $homepage->experience]);
    }

    public function updateFreelance(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['freelance' => []]);

        $currentImageUrls = [];
        foreach ($homepage->freelance ?? [] as $item) {
            if (!empty($item['image'])) {
                $currentImageUrls[] = $this->pathFromUrl($item['image']);
            }
        }

        $freelance = $request->input('freelance', []);
        if (is_string($freelance)) {
            $freelance = json_decode($freelance, true) ?? [];
        }

        foreach ($freelance as $index => &$item) {
            $fileKey = "freelance_image_{$index}";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->put('homepage/freelance/' . $fileName, file_get_contents($file));
                $item['image'] = asset('storage/homepage/freelance/' . $fileName);
            }
        }

        $homepage->freelance = $freelance;
        $homepage->save();

        $newImageUrls = [];
        foreach ($freelance as $item) {
            if (!empty($item['image'])) {
                $newImageUrls[] = $this->pathFromUrl($item['image']);
            }
        }
        $this->deleteOldImages($currentImageUrls, $newImageUrls);

        return response()->json(['freelance' => $homepage->freelance]);
    }

    public function getSkills()
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['skill_categories' => []]);
        return response()->json(['skillCategories' => $homepage->skill_categories ?? []]);
    }

    public function getCertificates()
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['certificates' => []]);
        return response()->json(['certificates' => $homepage->certificates ?? []]);
    }

    public function updateSkills(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['skill_categories' => []]);

        $skillCategories = $request->input('skillCategories', []);
        if (is_string($skillCategories)) {
            $skillCategories = json_decode($skillCategories, true) ?? [];
        }

        $homepage->skill_categories = $skillCategories;
        $homepage->save();

        return response()->json(['skillCategories' => $homepage->skill_categories]);
    }

    public function updateCertificates(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['certificates' => []]);

        $currentImageUrls = [];
        foreach ($homepage->certificates ?? [] as $cert) {
            if (!empty($cert['img'])) {
                $currentImageUrls[] = $this->pathFromUrl($cert['img']);
            }
        }

        $certificates = $request->input('certificates', []);
        if (is_string($certificates)) {
            $certificates = json_decode($certificates, true) ?? [];
        }

        foreach ($certificates as $index => &$cert) {
            $fileKey = "cert_image_{$index}";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                Storage::disk('public')->put('homepage/certificates/' . $fileName, file_get_contents($file));
                $cert['img'] = asset('storage/homepage/certificates/' . $fileName);
            }
            if (isset($cert['aptitudes'])) {
                foreach ($cert['aptitudes'] as $aptIndex => &$apt) {
                    if ($apt['type'] === 'img') {
                        $aptFileKey = "cert_apt_image_{$index}_{$aptIndex}";
                        if ($request->hasFile($aptFileKey)) {
                            $file = $request->file($aptFileKey);
                            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                            Storage::disk('public')->put('homepage/certificates/apt/' . $fileName, file_get_contents($file));
                            $apt['source'] = asset('storage/homepage/certificates/apt/' . $fileName);
                        }
                    }
                }
            }
        }

        $homepage->certificates = $certificates;
        $homepage->save();

        $newImageUrls = [];
        foreach ($certificates as $cert) {
            if (!empty($cert['img'])) {
                $newImageUrls[] = $this->pathFromUrl($cert['img']);
            }
        }
        $this->deleteOldImages($currentImageUrls, $newImageUrls);

        return response()->json(['certificates' => $homepage->certificates]);
    }

    public function getIntro()
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], [
            'name' => null,
            'tags' => [],
            'description' => null,
            'socials' => [],
            'logo_url' => null,
            'photo_url' => null,
            'stack' => [],
            'show_contact_form' => false,
        ]);

        return response()->json([
            'name' => $homepage->name,
            'tags' => $homepage->tags ?? [],
            'description' => $homepage->description,
            'socials' => $homepage->socials ?? [],
            'logoUrl' => $homepage->logo_url ? asset($homepage->logo_url) : null,
            'photoUrl' => $homepage->photo_url ? asset($homepage->photo_url) : null,
            'stack' => $homepage->stack ?? [],
            'showContactForm' => is_array($homepage->show_contact_form)
                ? $homepage->show_contact_form
                : [
                    'socials' => (bool) ($homepage->show_contact_form ?? false),
                    'freelance' => (bool) ($homepage->show_contact_form ?? false),
                  ],
        ]);
    }

    public function updateIntro(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], [
            'name' => null,
            'tags' => [],
            'description' => null,
            'socials' => [],
            'logo_url' => null,
            'photo_url' => null,
            'stack' => [],
            'show_contact_form' => false,
        ]);

        if ($request->hasFile('logo')) {
            $oldLogo = $homepage->logo_url ? $this->pathFromUrl($homepage->logo_url) : null;
            $logo = $request->file('logo');
            $logoName = uniqid() . time() . '.' . $logo->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/' . $logoName, file_get_contents($logo));
            $homepage->logo_url = 'storage/homepage/' . $logoName;
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }
        }

        if ($request->hasFile('photo')) {
            $oldPhoto = $homepage->photo_url ? $this->pathFromUrl($homepage->photo_url) : null;
            $photo = $request->file('photo');
            $photoName = uniqid() . time() . '.' . $photo->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/' . $photoName, file_get_contents($photo));
            $homepage->photo_url = 'storage/homepage/' . $photoName;
            if ($oldPhoto && Storage::disk('public')->exists($oldPhoto)) {
                Storage::disk('public')->delete($oldPhoto);
            }
        }

        $intro = $request->input('intro', []);
        if (is_string($intro)) {
            $intro = json_decode($intro, true) ?? [];
        }

        if (isset($intro['name'])) {
            $homepage->name = $intro['name'];
        }
        if (isset($intro['tags'])) {
            $homepage->tags = $intro['tags'];
        }
        if (isset($intro['description'])) {
            $homepage->description = $intro['description'];
        }
        if (isset($intro['socials'])) {
            $homepage->socials = $intro['socials'];
        }
        if (isset($intro['showContactForm'])) {
            $homepage->show_contact_form = $intro['showContactForm'];
        }
        if (isset($intro['stack'])) {
            $stack = $intro['stack'];
            foreach ($stack as $index => &$item) {
                $fileKey = "stack_image_{$index}";
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/stack/' . $fileName, file_get_contents($file));
                    $item['image'] = asset('storage/homepage/stack/' . $fileName);
                }
            }
            $homepage->stack = $stack;
        }

        $homepage->save();

        return response()->json([
            'name' => $homepage->name,
            'tags' => $homepage->tags ?? [],
            'description' => $homepage->description,
            'socials' => $homepage->socials ?? [],
            'logoUrl' => $homepage->logo_url ? asset($homepage->logo_url) : null,
            'photoUrl' => $homepage->photo_url ? asset($homepage->photo_url) : null,
            'stack' => $homepage->stack ?? [],
            'showContactForm' => is_array($homepage->show_contact_form)
                ? $homepage->show_contact_form
                : [
                    'socials' => (bool) ($homepage->show_contact_form ?? false),
                    'freelance' => (bool) ($homepage->show_contact_form ?? false),
                  ],
        ]);
    }

    // ============ PROJECTS ============
    public function addProject(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);
        $project = $request->input('project', []);

        if (is_string($project)) {
            $project = json_decode($project, true) ?? [];
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
            $project['img'] = asset('storage/homepage/projects/' . $fileName);
        }

        $projects = $homepage->projects ?? [];
        $projects[] = $project;
        $homepage->projects = $projects;
        $homepage->save();

        return response()->json(['projects' => $homepage->projects]);
    }

    public function deleteProject(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);
        $id = $request->input('id');

        $projects = array_filter($homepage->projects ?? [], function ($p) use ($id) {
            return ($p['id'] ?? '') !== $id;
        });

        $homepage->projects = array_values($projects);
        $homepage->save();

        return response()->json(['projects' => $homepage->projects]);
    }

    // ============ EXPERIENCE ============
    public function addExperience(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['experience' => []]);
        $experience = $request->input('experience', []);

        if (is_string($experience)) {
            $experience = json_decode($experience, true) ?? [];
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
            $experience['img'] = asset('storage/homepage/experience/' . $fileName);
        }

        $experiences = $homepage->experience ?? [];
        $experiences[] = $experience;
        $homepage->experience = $experiences;
        $homepage->save();

        return response()->json(['experience' => $homepage->experience]);
    }

    public function deleteExperience(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['experience' => []]);
        $id = $request->input('id');

        $experience = array_filter($homepage->experience ?? [], function ($e) use ($id) {
            return ($e['id'] ?? '') !== $id;
        });

        $homepage->experience = array_values($experience);
        $homepage->save();

        return response()->json(['experience' => $homepage->experience]);
    }

    // ============ FREELANCE ============
    public function addFreelance(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['freelance' => []]);
        $freelance = $request->input('freelance', []);

        if (is_string($freelance)) {
            $freelance = json_decode($freelance, true) ?? [];
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/freelance/' . $fileName, file_get_contents($file));
            $freelance['image'] = asset('storage/homepage/freelance/' . $fileName);
        }

        $freelanceList = $homepage->freelance ?? [];
        $freelanceList[] = $freelance;
        $homepage->freelance = $freelanceList;
        $homepage->save();

        return response()->json(['freelance' => $homepage->freelance]);
    }

    public function deleteFreelance(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['freelance' => []]);
        $id = $request->input('id');

        $freelance = array_filter($homepage->freelance ?? [], function ($f) use ($id) {
            return ($f['id'] ?? '') !== $id;
        });

        $homepage->freelance = array_values($freelance);
        $homepage->save();

        return response()->json(['freelance' => $homepage->freelance]);
    }

    // ============ SKILLS ============
    public function addSkillCategory(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['skill_categories' => []]);
        $skillCategory = $request->input('skillCategory', []);

        if (is_string($skillCategory)) {
            $skillCategory = json_decode($skillCategory, true) ?? [];
        }

        $skillCategories = $homepage->skill_categories ?? [];
        $skillCategories[] = $skillCategory;
        $homepage->skill_categories = $skillCategories;
        $homepage->save();

        return response()->json(['skillCategories' => $homepage->skill_categories]);
    }

    public function deleteSkillCategory(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['skill_categories' => []]);
        $id = $request->input('id');

        $skillCategories = array_filter($homepage->skill_categories ?? [], function ($s) use ($id) {
            return ($s['id'] ?? '') !== $id;
        });

        $homepage->skill_categories = array_values($skillCategories);
        $homepage->save();

        return response()->json(['skillCategories' => $homepage->skill_categories]);
    }

    // ============ CERTIFICATES ============
    public function addCertificate(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['certificates' => []]);
        $certificate = $request->input('certificate', []);

        if (is_string($certificate)) {
            $certificate = json_decode($certificate, true) ?? [];
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/certificates/' . $fileName, file_get_contents($file));
            $certificate['img'] = asset('storage/homepage/certificates/' . $fileName);
        }

        $certificates = $homepage->certificates ?? [];
        $certificates[] = $certificate;
        $homepage->certificates = $certificates;
        $homepage->save();

        return response()->json(['certificates' => $homepage->certificates]);
    }

    public function deleteCertificate(Request $request)
    {
        $homepage = HomePage::firstOrCreate(['id' => 1], ['certificates' => []]);
        $id = $request->input('id');

        $certificates = array_filter($homepage->certificates ?? [], function ($c) use ($id) {
            return ($c['id'] ?? '') !== $id;
        });

        $homepage->certificates = array_values($certificates);
        $homepage->save();

        return response()->json(['certificates' => $homepage->certificates]);
    }
}
