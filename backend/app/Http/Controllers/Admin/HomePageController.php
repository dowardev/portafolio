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

    public function show()
    {
        $homepage = HomePage::firstOrCreate(
            ['id' => 1],
            [
                'name' => null,
                'tags' => [],
                'description' => null,
                'socials' => [],
                'logo_url' => null,
                'photo_url' => null,
                'stack' => [],
                'skill_categories' => [],
                'experience' => [],
                'projects' => [],
                'certificates' => [],
                'freelance' => [],
            ]
        );

        return response()->json([
            'name' => $homepage->name,
            'tags' => $homepage->tags ?? [],
            'description' => $homepage->description,
            'socials' => $homepage->socials ?? [],
            'logoUrl' => $homepage->logo_url ? asset($homepage->logo_url) : null,
            'photoUrl' => $homepage->photo_url ? asset($homepage->photo_url) : null,
            'stack' => $homepage->stack ?? [],
            'skillCategories' => $homepage->skill_categories ?? [],
            'experience' => $homepage->experience ?? [],
            'projects' => $homepage->projects ?? [],
            'certificates' => $homepage->certificates ?? [],
            'freelance' => $homepage->freelance ?? [],
            'showContactForm' => is_array($homepage->show_contact_form) 
                ? $homepage->show_contact_form 
                : [
                    'socials' => (bool) ($homepage->show_contact_form ?? false),
                    'freelance' => (bool) ($homepage->show_contact_form ?? false),
                  ],
        ]);
    }

    public function update(Request $request)
    {
        $homepage = HomePage::firstOrCreate(
            ['id' => 1],
            [
                'name' => null,
                'tags' => [],
                'description' => null,
                'socials' => [],
                'logo_url' => null,
                'photo_url' => null,
                'stack' => [],
                'skill_categories' => [],
                'experience' => [],
                'projects' => [],
                'certificates' => [],
                'freelance' => [],
                'show_contact_form' => false,
            ]
        );

        $currentImageUrls = $this->getAllCurrentImageUrls($homepage);

        $payload = $request->input('payload');
        $payloadDecoded = json_decode($payload, true);

        // Basic fields
        if (isset($payloadDecoded['name'])) {
            $homepage->name = $payloadDecoded['name'];
        }
        if (isset($payloadDecoded['tags'])) {
            $homepage->tags = $payloadDecoded['tags'];
        }
        if (isset($payloadDecoded['description'])) {
            $homepage->description = $payloadDecoded['description'];
        }
        if (isset($payloadDecoded['socials'])) {
            $homepage->socials = $payloadDecoded['socials'];
        }
        if (isset($payloadDecoded['showContactForm'])) {
            $homepage->show_contact_form = $payloadDecoded['showContactForm'];
        }

        // Logo and photo
        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $logoName = uniqid() . time() . '.' . $logo->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/' . $logoName, file_get_contents($logo));
            $homepage->logo_url = 'storage/homepage/' . $logoName;
        }

        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoName = uniqid() . time() . '.' . $photo->getClientOriginalExtension();
            Storage::disk('public')->put('homepage/' . $photoName, file_get_contents($photo));
            $homepage->photo_url = 'storage/homepage/' . $photoName;
        }

        // Stack images
        if (isset($payloadDecoded['stack'])) {
            $stack = $payloadDecoded['stack'];
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

        // Skill categories
        if (isset($payloadDecoded['skillCategories'])) {
            $homepage->skill_categories = $payloadDecoded['skillCategories'];
        }

        // Experience images
        if (isset($payloadDecoded['experience'])) {
            $experience = $payloadDecoded['experience'];
            foreach ($experience as $index => &$exp) {
                // Main image
                $fileKey = "exp_image_{$index}";
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/experience/' . $fileName, file_get_contents($file));
                    $exp['img'] = asset('storage/homepage/experience/' . $fileName);
                }
                // Tech images (now only iconName)
                if (isset($exp['technologies'])) {
                    foreach ($exp['technologies'] as $techIndex => &$tech) {
                        // Only process if iconName exists (new format)
                        if (isset($tech['iconName'])) {
                            // iconName is sent directly, no image upload needed
                        }
                    }
                }
            }
            $homepage->experience = $experience;
        }

        // Projects images
        if (isset($payloadDecoded['projects'])) {
            $projects = $payloadDecoded['projects'];
            foreach ($projects as $index => &$project) {
                // Main image
                $fileKey = "project_image_{$index}";
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/projects/' . $fileName, file_get_contents($file));
                    $project['img'] = asset('storage/homepage/projects/' . $fileName);
                }
                // Source image
                $sourceFileKey = "project_source_image_{$index}";
                if ($request->hasFile($sourceFileKey)) {
                    $file = $request->file($sourceFileKey);
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/projects/source/' . $fileName, file_get_contents($file));
                    $project['source']['img'] = asset('storage/homepage/projects/source/' . $fileName);
                }
                // Tech images (now only iconName)
                if (isset($project['technologies'])) {
                    foreach ($project['technologies'] as $techIndex => &$tech) {
                        // Only process if iconName exists (new format)
                        if (isset($tech['iconName'])) {
                            // iconName is sent directly, no image upload needed
                        }
                    }
                }
            }
            $homepage->projects = $projects;
        }

        // Certificates images
        if (isset($payloadDecoded['certificates'])) {
            $certificates = $payloadDecoded['certificates'];
            foreach ($certificates as $index => &$cert) {
                // Main image
                $fileKey = "cert_image_{$index}";
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/certificates/' . $fileName, file_get_contents($file));
                    $cert['img'] = asset('storage/homepage/certificates/' . $fileName);
                }
                // Aptitude images
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
        }

        // Freelance images
        if (isset($payloadDecoded['freelance'])) {
            $freelance = $payloadDecoded['freelance'];
            foreach ($freelance as $index => &$platform) {
                // Platform image
                $fileKey = "freelance_image_{$index}";
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                    Storage::disk('public')->put('homepage/freelance/' . $fileName, file_get_contents($file));
                    $platform['image'] = asset('storage/homepage/freelance/' . $fileName);
                }
                // Comment images
                if (isset($platform['comments'])) {
                    foreach ($platform['comments'] as $commentIndex => &$comment) {
                        $commentFileKey = "freelance_comment_image_{$index}_{$commentIndex}";
                        if ($request->hasFile($commentFileKey)) {
                            $file = $request->file($commentFileKey);
                            $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                            Storage::disk('public')->put('homepage/freelance/comments/' . $fileName, file_get_contents($file));
                            $comment['image'] = asset('storage/homepage/freelance/comments/' . $fileName);
                        }
                    }
                }
            }
            $homepage->freelance = $freelance;
        }

        $homepage->save();

        $newImageUrls = $this->getAllCurrentImageUrls($homepage);
        $this->deleteOldImages($currentImageUrls, $newImageUrls);

        return response()->json([
            'name' => $homepage->name,
            'tags' => $homepage->tags ?? [],
            'description' => $homepage->description,
            'socials' => $homepage->socials ?? [],
            'logoUrl' => $homepage->logo_url ? asset($homepage->logo_url) : null,
            'photoUrl' => $homepage->photo_url ? asset($homepage->photo_url) : null,
            'stack' => $homepage->stack ?? [],
            'skillCategories' => $homepage->skill_categories ?? [],
            'experience' => $homepage->experience ?? [],
            'projects' => $homepage->projects ?? [],
            'certificates' => $homepage->certificates ?? [],
            'freelance' => $homepage->freelance ?? [],
            'showContactForm' => is_array($homepage->show_contact_form) 
                ? $homepage->show_contact_form 
                : [
                    'socials' => (bool) ($homepage->show_contact_form ?? false),
                    'freelance' => (bool) ($homepage->show_contact_form ?? false),
                  ],
        ]);
    }
}
