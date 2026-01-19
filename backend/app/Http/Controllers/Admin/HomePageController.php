<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomePage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            ]
        );

        return response()->json([
            'name' => $homepage->name,
            'tags' => $homepage->tags ?? [],
            'description' => $homepage->description,
            'socials' => $homepage->socials ?? [],
            'logoUrl' => $homepage->logo_url ? asset($homepage->logo_url) : null,
            'photoUrl' => $homepage->photo_url ? asset($homepage->photo_url) : null,
        ]);
    }

    public function update(Request $request)
    {
        \Log::info('Homepage update request received');
        \Log::info('Has logo file: ' . ($request->hasFile('logo') ? 'Yes' : 'No'));
        \Log::info('Has photo file: ' . ($request->hasFile('photo') ? 'Yes' : 'No'));

        $homepage = HomePage::firstOrCreate(
            ['id' => 1],
            [
                'name' => null,
                'tags' => [],
                'description' => null,
                'socials' => [],
                'logo_url' => null,
                'photo_url' => null,
            ]
        );

        $payload = $request->input('payload');
        $payloadDecoded = json_decode($payload, true);

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

        if ($request->hasFile('logo')) {
            \Log::info('Processing logo file...');
            $logo = $request->file('logo');
            $logoName = uniqid() . time() . '.' . $logo->getClientOriginalExtension();
            \Log::info('Logo name: ' . $logoName);
            Storage::disk('public')->put('homepage/' . $logoName, file_get_contents($logo));
            $homepage->logo_url = asset('storage/homepage/' . $logoName);
            \Log::info('Logo saved at: ' . $homepage->logo_url);
        }

        if ($request->hasFile('photo')) {
            \Log::info('Processing photo file...');
            $photo = $request->file('photo');
            $photoName = uniqid() . time() . '.' . $photo->getClientOriginalExtension();
            \Log::info('Photo name: ' . $photoName);
            Storage::disk('public')->put('homepage/' . $photoName, file_get_contents($photo));
            $homepage->photo_url = asset('storage/homepage/' . $photoName);
            \Log::info('Photo saved at: ' . $homepage->photo_url);
        }

        $homepage->save();

        return response()->json([
            'name' => $homepage->name,
            'tags' => $homepage->tags ?? [],
            'description' => $homepage->description,
            'socials' => $homepage->socials ?? [],
            'logoUrl' => $homepage->logo_url ? asset($homepage->logo_url) : null,
            'photoUrl' => $homepage->photo_url ? asset($homepage->photo_url) : null,
        ]);
    }
}
