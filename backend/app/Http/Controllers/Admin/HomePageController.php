<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomePageController extends Controller
{
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
            'showContactForm' => $homepage->show_contact_form ?? false,
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

        // Skill categories images
        if (isset($payloadDecoded['skillCategories'])) {
            $skillCategories = $payloadDecoded['skillCategories'];
            foreach ($skillCategories as $catIndex => &$category) {
                if (isset($category['technologies'])) {
                    foreach ($category['technologies'] as $techIndex => &$tech) {
                        if ($tech['type'] === 'img') {
                            $fileKey = "skill_image_{$catIndex}_{$techIndex}";
                            if ($request->hasFile($fileKey)) {
                                $file = $request->file($fileKey);
                                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                                Storage::disk('public')->put('homepage/skills/' . $fileName, file_get_contents($file));
                                $tech['image'] = asset('storage/homepage/skills/' . $fileName);
                            }
                        }
                    }
                }
            }
            $homepage->skill_categories = $skillCategories;
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
                // Tech images
                if (isset($exp['technologies'])) {
                    foreach ($exp['technologies'] as $techIndex => &$tech) {
                        if ($tech['type'] === 'img') {
                            $techFileKey = "exp_tech_image_{$index}_{$techIndex}";
                            if ($request->hasFile($techFileKey)) {
                                $file = $request->file($techFileKey);
                                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                                Storage::disk('public')->put('homepage/experience/tech/' . $fileName, file_get_contents($file));
                                $tech['source'] = asset('storage/homepage/experience/tech/' . $fileName);
                            }
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
                // Tech images
                if (isset($project['technologies'])) {
                    foreach ($project['technologies'] as $techIndex => &$tech) {
                        if ($tech['type'] === 'img') {
                            $techFileKey = "project_tech_image_{$index}_{$techIndex}";
                            if ($request->hasFile($techFileKey)) {
                                $file = $request->file($techFileKey);
                                $fileName = uniqid() . time() . '.' . $file->getClientOriginalExtension();
                                Storage::disk('public')->put('homepage/projects/tech/' . $fileName, file_get_contents($file));
                                $tech['source'] = asset('storage/homepage/projects/tech/' . $fileName);
                            }
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
            'showContactForm' => $homepage->show_contact_form ?? false,
        ]);
    }
}
