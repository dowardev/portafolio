<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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

    // Projects are now managed via addProject and updateProject (individual operations)

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

    // ============ EXPERIENCE ============

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
        $validator = Validator::make($request->all(), [
            'project' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);
        $project = $request->input('project', []);

        if (is_string($project)) {
            $project = json_decode($project, true) ?? [];
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
            $project['img'] = asset('storage/homepage/projects/' . $fileName);
        }

        if (empty($project['id'])) {
            $project['id'] = uniqid();
        }

        $projects = $homepage->projects ?? [];
        $projects[] = $project;
        $homepage->projects = $projects;
        $homepage->save();

        return response()->json(['projects' => $homepage->projects]);
    }

    public function updateProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
            'project' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);
        $id = $request->input('id');
        $projectData = $request->input('project', []);

        if (is_string($projectData)) {
            $projectData = json_decode($projectData, true) ?? [];
        }

        $projects = $homepage->projects ?? [];
        $found = false;

        foreach ($projects as $index => &$project) {
            if (($project['id'] ?? '') === $id) {
                if ($request->hasFile('image')) {
                    if (!empty($project['img'])) {
                        $oldImagePath = $this->pathFromUrl($project['img']);
                        if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                            Storage::disk('public')->delete($oldImagePath);
                        }
                    }
                    $file = $request->file('image');
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
                    $projectData['img'] = asset('storage/homepage/projects/' . $fileName);
                }
                $project = array_merge($project, $projectData);
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json(['error' => 'Proyecto no encontrado'], 404);
        }

        $homepage->projects = $projects;
        $homepage->save();

        return response()->json(['projects' => $homepage->projects]);
    }

    public function deleteProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['projects' => []]);
        $id = $request->input('id');

        $projects = $homepage->projects ?? [];
        $projectToDelete = null;
        foreach ($projects as $project) {
            if (($project['id'] ?? '') === $id) {
                $projectToDelete = $project;
                break;
            }
        }

        if ($projectToDelete && !empty($projectToDelete['img'])) {
            $oldImagePath = $this->pathFromUrl($projectToDelete['img']);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $projects = array_filter($projects, function ($p) use ($id) {
            return ($p['id'] ?? '') !== $id;
        });

        $homepage->projects = array_values($projects);
        $homepage->save();

        return response()->json(['projects' => $homepage->projects]);
    }

    // ============ EXPERIENCE ============
    public function addExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'experience' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

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

        if (empty($experience['id'])) {
            $experience['id'] = uniqid();
        }

        $experiences = $homepage->experience ?? [];
        $experiences[] = $experience;
        $homepage->experience = $experiences;
        $homepage->save();

        return response()->json(['experience' => $homepage->experience]);
    }

    public function updateExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
            'experience' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['experience' => []]);
        $id = $request->input('id');
        $expData = $request->input('experience', []);

        if (is_string($expData)) {
            $expData = json_decode($expData, true) ?? [];
        }

        $experiences = $homepage->experience ?? [];
        $found = false;

        foreach ($experiences as $index => &$exp) {
            if (($exp['id'] ?? '') === $id) {
                if ($request->hasFile('image')) {
                    if (!empty($exp['img'])) {
                        $oldImagePath = $this->pathFromUrl($exp['img']);
                        if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                            Storage::disk('public')->delete($oldImagePath);
                        }
                    }
                    $file = $request->file('image');
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
                    $expData['img'] = asset('storage/homepage/experience/' . $fileName);
                }
                $exp = array_merge($exp, $expData);
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json(['error' => 'Experiencia no encontrada'], 404);
        }

        $homepage->experience = $experiences;
        $homepage->save();

        return response()->json(['experience' => $homepage->experience]);
    }

    public function deleteExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['experience' => []]);
        $id = $request->input('id');

        $experience = $homepage->experience ?? [];
        $expToDelete = null;
        foreach ($experience as $exp) {
            if (($exp['id'] ?? '') === $id) {
                $expToDelete = $exp;
                break;
            }
        }

        if ($expToDelete && !empty($expToDelete['img'])) {
            $oldImagePath = $this->pathFromUrl($expToDelete['img']);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $experience = array_filter($experience, function ($e) use ($id) {
            return ($e['id'] ?? '') !== $id;
        });

        $homepage->experience = array_values($experience);
        $homepage->save();

        return response()->json(['experience' => $homepage->experience]);
    }

    // ============ FREELANCE ============
    public function addFreelance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'freelance' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

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

        if (empty($freelance['id'])) {
            $freelance['id'] = uniqid();
        }

        $freelanceList = $homepage->freelance ?? [];
        $freelanceList[] = $freelance;
        $homepage->freelance = $freelanceList;
        $homepage->save();

        return response()->json(['freelance' => $homepage->freelance]);
    }

    public function updateFreelance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
            'freelance' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['freelance' => []]);
        $id = $request->input('id');
        $freelanceData = $request->input('freelance', []);

        if (is_string($freelanceData)) {
            $freelanceData = json_decode($freelanceData, true) ?? [];
        }

        $freelanceList = $homepage->freelance ?? [];
        $found = false;

        foreach ($freelanceList as $index => &$item) {
            if (($item['id'] ?? '') === $id) {
                if ($request->hasFile('image')) {
                    if (!empty($item['image'])) {
                        $oldImagePath = $this->pathFromUrl($item['image']);
                        if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                            Storage::disk('public')->delete($oldImagePath);
                        }
                    }
                    $file = $request->file('image');
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/freelance/' . $fileName, file_get_contents($file));
                    $freelanceData['image'] = asset('storage/homepage/freelance/' . $fileName);
                }
                $item = array_merge($item, $freelanceData);
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json(['error' => 'Freelance no encontrado'], 404);
        }

        $homepage->freelance = $freelanceList;
        $homepage->save();

        return response()->json(['freelance' => $homepage->freelance]);
    }

    public function deleteFreelance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['freelance' => []]);
        $id = $request->input('id');

        $freelance = $homepage->freelance ?? [];
        $itemToDelete = null;
        foreach ($freelance as $item) {
            if (($item['id'] ?? '') === $id) {
                $itemToDelete = $item;
                break;
            }
        }

        if ($itemToDelete && !empty($itemToDelete['image'])) {
            $oldImagePath = $this->pathFromUrl($itemToDelete['image']);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $freelance = array_filter($freelance, function ($f) use ($id) {
            return ($f['id'] ?? '') !== $id;
        });

        $homepage->freelance = array_values($freelance);
        $homepage->save();

        return response()->json(['freelance' => $homepage->freelance]);
    }

    // ============ SKILLS ============
    public function addSkillCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'skillCategory' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['skill_categories' => []]);
        $skillCategory = $request->input('skillCategory', []);

        if (is_string($skillCategory)) {
            $skillCategory = json_decode($skillCategory, true) ?? [];
        }

        if (empty($skillCategory['id'])) {
            $skillCategory['id'] = uniqid();
        }

        $skillCategories = $homepage->skill_categories ?? [];
        $skillCategories[] = $skillCategory;
        $homepage->skill_categories = $skillCategories;
        $homepage->save();

        return response()->json(['skillCategories' => $homepage->skill_categories]);
    }

    public function updateSkillCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
            'skillCategory' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['skill_categories' => []]);
        $id = $request->input('id');
        $categoryData = $request->input('skillCategory', []);

        if (is_string($categoryData)) {
            $categoryData = json_decode($categoryData, true) ?? [];
        }

        $skillCategories = $homepage->skill_categories ?? [];
        $found = false;

        foreach ($skillCategories as $index => &$category) {
            if (($category['id'] ?? '') === $id) {
                $category = array_merge($category, $categoryData);
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        }

        $homepage->skill_categories = $skillCategories;
        $homepage->save();

        return response()->json(['skillCategories' => $homepage->skill_categories]);
    }

    public function deleteSkillCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

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
        $validator = Validator::make($request->all(), [
            'certificate' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

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

        if (empty($certificate['id'])) {
            $certificate['id'] = uniqid();
        }

        $certificates = $homepage->certificates ?? [];
        $certificates[] = $certificate;
        $homepage->certificates = $certificates;
        $homepage->save();

        return response()->json(['certificates' => $homepage->certificates]);
    }

    public function updateCertificate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
            'certificate' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['certificates' => []]);
        $id = $request->input('id');
        $certData = $request->input('certificate', []);

        if (is_string($certData)) {
            $certData = json_decode($certData, true) ?? [];
        }

        $certificates = $homepage->certificates ?? [];
        $found = false;

        foreach ($certificates as $index => &$cert) {
            if (($cert['id'] ?? '') === $id) {
                if ($request->hasFile('image')) {
                    if (!empty($cert['img'])) {
                        $oldImagePath = $this->pathFromUrl($cert['img']);
                        if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                            Storage::disk('public')->delete($oldImagePath);
                        }
                    }
                    $file = $request->file('image');
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/certificates/' . $fileName, file_get_contents($file));
                    $certData['img'] = asset('storage/homepage/certificates/' . $fileName);
                }
                $cert = array_merge($cert, $certData);
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json(['error' => 'Certificado no encontrado'], 404);
        }

        $homepage->certificates = $certificates;
        $homepage->save();

        return response()->json(['certificates' => $homepage->certificates]);
    }

    public function deleteCertificate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $homepage = HomePage::firstOrCreate(['id' => 1], ['certificates' => []]);
        $id = $request->input('id');

        $certificates = $homepage->certificates ?? [];
        $certToDelete = null;
        foreach ($certificates as $cert) {
            if (($cert['id'] ?? '') === $id) {
                $certToDelete = $cert;
                break;
            }
        }

        if ($certToDelete && !empty($certToDelete['img'])) {
            $oldImagePath = $this->pathFromUrl($certToDelete['img']);
            if ($oldImagePath && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        $certificates = array_filter($certificates, function ($c) use ($id) {
            return ($c['id'] ?? '') !== $id;
        });

        $homepage->certificates = array_values($certificates);
        $homepage->save();

        return response()->json(['certificates' => $homepage->certificates]);
    }
}
