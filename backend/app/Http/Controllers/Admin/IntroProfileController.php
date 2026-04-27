<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IntroProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IntroProfileController extends Controller
{
    private function getExtensionFromMime($file): string
    {
        $mime = $file->getMimeType();
        $mimeToExt = [
            'image/svg+xml' => 'svg',
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/x-icon' => 'ico',
        ];
        return $mimeToExt[$mime] ?? $file->getClientOriginalExtension();
    }

    private function getAllCurrentImageUrls(IntroProfile $introProfile): array
    {
        $urls = [];

        if ($introProfile->logo_url) {
            $urls[] = $this->pathFromUrl($introProfile->logo_url);
        }
        if ($introProfile->photo_url) {
            $urls[] = $this->pathFromUrl($introProfile->photo_url);
        }

        return array_filter($urls);
    }

    private function deleteOldImages(array $currentUrls, array $newUrls): void
    {
        $toDelete = array_diff($currentUrls, $newUrls);

        foreach ($toDelete as $url) {
            $path = $this->pathFromUrl($url);
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    private function pathFromUrl(string $url): string
    {
        if (preg_match('#^https?://[^/]+/storage/(.+)$#', $url, $matches)) {
            return $matches[1];
        }

        $assetUrl = rtrim(asset(''), '/');
        if ($assetUrl && str_starts_with($url, $assetUrl)) {
            $path = ltrim(str_replace($assetUrl, '', $url), '/');
            if (str_starts_with($path, 'storage/')) {
                $path = substr($path, 8);
            }
            return $path;
        }

        if (preg_match('#^//[^/]+/storage/(.+)$#', $url, $matches)) {
            return $matches[1];
        }

        if (str_starts_with($url, 'storage/')) {
            return substr($url, 8);
        }

        return ltrim(str_replace(asset(''), '', $url), '/');
    }

    public function getIntro()
    {
        $introProfile = IntroProfile::firstOrCreate(['id' => 1], [
            'name' => null,
            'tags' => [],
            'description' => null,
            'socials' => [],
            'logo_url' => null,
            'photo_url' => null,
            'show_contact_form' => false,
        ]);

        return response()->json([
            'name' => $introProfile->name,
            'tags' => $introProfile->tags ?? [],
            'description' => $introProfile->description,
            'socials' => $introProfile->socials ?? [],
            'logoUrl' => $introProfile->logo_url ? asset($introProfile->logo_url) : null,
            'photoUrl' => $introProfile->photo_url ? asset($introProfile->photo_url) : null,
            'showContactForm' => is_array($introProfile->show_contact_form)
                ? $introProfile->show_contact_form
                : [
                    'socials' => (bool) ($introProfile->show_contact_form ?? false),
                    'freelance' => (bool) ($introProfile->show_contact_form ?? false),
                  ],
        ]);
    }

    public function updateIntro(Request $request)
    {
        $introProfile = IntroProfile::firstOrCreate(['id' => 1], [
            'name' => null,
            'tags' => [],
            'description' => null,
            'socials' => [],
            'logo_url' => null,
            'photo_url' => null,
            'show_contact_form' => false,
        ]);

        $currentImageUrls = $this->getAllCurrentImageUrls($introProfile);
        $newImageUrls = [];

        if ($request->hasFile('logo')) {
            $oldLogo = $introProfile->logo_url ? $this->pathFromUrl($introProfile->logo_url) : null;
            $logo = $request->file('logo');
            $logoName = uniqid() . time() . '.' . $this->getExtensionFromMime($logo);
            Storage::disk('public')->put('intro_profiles/' . $logoName, file_get_contents($logo));
            $introProfile->logo_url = 'storage/intro_profiles/' . $logoName;
            $newImageUrls[] = 'intro_profiles/' . $logoName;
            if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                Storage::disk('public')->delete($oldLogo);
            }
        }

        if ($request->hasFile('photo')) {
            $oldPhoto = $introProfile->photo_url ? $this->pathFromUrl($introProfile->photo_url) : null;
            $photo = $request->file('photo');
            $photoName = uniqid() . time() . '.' . $this->getExtensionFromMime($photo);
            Storage::disk('public')->put('intro_profiles/' . $photoName, file_get_contents($photo));
            $introProfile->photo_url = 'storage/intro_profiles/' . $photoName;
            $newImageUrls[] = 'intro_profiles/' . $photoName;
            if ($oldPhoto && Storage::disk('public')->exists($oldPhoto)) {
                Storage::disk('public')->delete($oldPhoto);
            }
        }

        $intro = $request->input('intro', []);
        if (is_string($intro)) {
            $intro = json_decode($intro, true) ?? [];
        }

        if (isset($intro['name'])) {
            $introProfile->name = $intro['name'];
        }
        if (isset($intro['tags'])) {
            $introProfile->tags = $intro['tags'];
        }
        if (isset($intro['description'])) {
            $introProfile->description = $intro['description'];
        }
        if (isset($intro['socials'])) {
            $introProfile->socials = $intro['socials'];
        }
        if (isset($intro['showContactForm'])) {
            $introProfile->show_contact_form = $intro['showContactForm'];
        } elseif (isset($intro['show_contact_form'])) {
            $introProfile->show_contact_form = $intro['show_contact_form'];
        }

        $introProfile->save();

        $this->deleteOldImages($currentImageUrls, $newImageUrls);

        return response()->json([
            'name' => $introProfile->name,
            'tags' => $introProfile->tags ?? [],
            'description' => $introProfile->description,
            'socials' => $introProfile->socials ?? [],
            'logoUrl' => $introProfile->logo_url ? asset($introProfile->logo_url) : null,
            'photoUrl' => $introProfile->photo_url ? asset($introProfile->photo_url) : null,
            'showContactForm' => is_array($introProfile->show_contact_form)
                ? $introProfile->show_contact_form
                : [
                    'socials' => (bool) ($introProfile->show_contact_form ?? false),
                    'freelance' => (bool) ($introProfile->show_contact_form ?? false),
                  ],
        ]);
    }
}