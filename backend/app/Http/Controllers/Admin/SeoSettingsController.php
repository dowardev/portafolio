<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SeoSettingsController extends Controller
{
    public function getSettings()
    {
        $settings = SeoSetting::firstOrCreate(
            ['id' => 1],
            [
                'site_title' => 'Dowar Blog',
                'site_description' => 'Blog personal de tecnología y desarrollo',
                'site_keywords' => 'blog, tecnología, desarrollo, programación',
                'lang_code' => 'es',
                'robots_index' => true,
            ]
        );

        $imageUrl = null;
        if ($settings->site_image_path) {
            $path = $this->pathFromUrl($settings->site_image_path);
            if ($path && Storage::disk('public')->exists($path)) {
                $imageUrl = asset($settings->site_image_path);
            }
        }

        return response()->json([
            'siteTitle' => $settings->site_title,
            'siteDescription' => $settings->site_description,
            'siteImageUrl' => $imageUrl,
            'siteImagePath' => $settings->site_image_path,
            'siteKeywords' => $settings->site_keywords,
            'langCode' => $settings->lang_code,
            'ogSiteName' => $settings->og_site_name,
            'twitterHandle' => $settings->twitter_handle,
            'robotsIndex' => (bool) $settings->robots_index,
            'canonicalBase' => $settings->canonical_base,
            'adminApiUrl' => $settings->admin_api_url,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $settings = SeoSetting::firstOrCreate(['id' => 1]);

        $validator = Validator::make($request->all(), [
            'siteTitle' => 'nullable|string|max:255',
            'siteDescription' => 'nullable|string|max:500',
            'siteKeywords' => 'nullable|string|max:500',
            'langCode' => 'nullable|string|max:10',
            'ogSiteName' => 'nullable|string|max:255',
            'twitterHandle' => 'nullable|string|max:255',
            'robotsIndex' => 'nullable|boolean',
            'canonicalBase' => 'nullable|string|max:255',
            'adminApiUrl' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'siteTitle', 'siteDescription', 'siteKeywords',
            'langCode', 'ogSiteName', 'twitterHandle',
            'robotsIndex', 'canonicalBase', 'adminApiUrl',
        ]);

        $map = [
            'siteTitle' => 'site_title',
            'siteDescription' => 'site_description',
            'siteKeywords' => 'site_keywords',
            'langCode' => 'lang_code',
            'ogSiteName' => 'og_site_name',
            'twitterHandle' => 'twitter_handle',
            'robotsIndex' => 'robots_index',
            'canonicalBase' => 'canonical_base',
            'adminApiUrl' => 'admin_api_url',
        ];

        foreach ($data as $key => $value) {
            if ($value !== null && isset($map[$key])) {
                $settings->{$map[$key]} = $value;
            }
        }

        if ($request->hasFile('siteImage')) {
            $oldPath = $settings->site_image_path ? $this->pathFromUrl($settings->site_image_path) : null;
            $file = $request->file('siteImage');
            $filename = uniqid().time().'.'.$file->getClientOriginalExtension();
            Storage::disk('public')->put('seo/'.$filename, file_get_contents($file));
            $settings->site_image_path = 'storage/seo/'.$filename;
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $settings->save();

        return $this->getSettings();
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
                return substr($path, 8);
            }

            return $path;
        }

        if (str_starts_with($url, 'storage/')) {
            return substr($url, 8);
        }

        return ltrim(str_replace(asset(''), '', $url), '/');
    }
}
