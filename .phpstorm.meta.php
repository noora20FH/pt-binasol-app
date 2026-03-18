<?php

namespace PHPSTORM_META {
    use Illuminate\Support\Facades\Schema;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;
    use Illuminate\Database\Migrations\Migration;

    // Fix IDE type hints for Laravel facades
    override(Schema::class, map([
        'create' => Blueprint::class,
        'table' => Blueprint::class,
    ]));

    // This file improves IDE autocompletion for Laravel
    // It doesn't change any runtime behavior
}
