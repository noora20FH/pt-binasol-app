<?php

use App\Http\Controllers\MidtransNotificationController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/midtrans/notification', [MidtransNotificationController::class, 'handle'])
    ->name('midtrans.notification');



