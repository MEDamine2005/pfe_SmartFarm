<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\IrrigationController;
use App\Http\Controllers\Api\IotController;
use App\Http\Controllers\Api\SensorController;
use App\Http\Controllers\Api\WeatherController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['status' => 'ok', 'app' => config('app.name')]);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/iot/readings', [IotController::class, 'storeReadings']);
Route::get('/iot/command', [IotController::class, 'command']);

Route::middleware('api.token')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/sensors', [SensorController::class, 'latest']);
    Route::get('/sensors/history', [SensorController::class, 'history']);
    Route::post('/sensors', [SensorController::class, 'store']);
    Route::get('/capteurs', [SensorController::class, 'history']);
    Route::post('/capteurs', [SensorController::class, 'store']);

    Route::get('/weather', [WeatherController::class, 'latest']);
    Route::post('/weather', [WeatherController::class, 'store']);
    Route::get('/donnerMeteo', [WeatherController::class, 'latest']);
    Route::post('/donnerMeteo', [WeatherController::class, 'store']);

    Route::get('/irrigation', [IrrigationController::class, 'show']);
    Route::post('/irrigation', [IrrigationController::class, 'control']);
    Route::get('/irrigation/events', [IrrigationController::class, 'events']);
    Route::get('/reglerIrrigation', [IrrigationController::class, 'show']);
    Route::post('/reglerIrrigation', [IrrigationController::class, 'control']);

    Route::get('/alerts', [AlertController::class, 'index']);
    Route::patch('/alerts/{alert}/read', [AlertController::class, 'markRead']);
    Route::delete('/alerts/{alert}', [AlertController::class, 'destroy']);
    Route::get('/alerte', [AlertController::class, 'index']);
    Route::patch('/alerte/{alert}/read', [AlertController::class, 'markRead']);
    Route::delete('/alerte/{alert}', [AlertController::class, 'destroy']);

    Route::get('/chat', [ChatController::class, 'index']);
    Route::post('/chat', [ChatController::class, 'store']);
    Route::get('/ChatIA', [ChatController::class, 'index']);
    Route::post('/ChatIA', [ChatController::class, 'store']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/reports', [AdminController::class, 'reports']);
        Route::get('/Repport', [AdminController::class, 'reports']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::patch('/users/{user}', [AdminController::class, 'updateUser']);
        Route::get('/iot/devices', [AdminController::class, 'devices']);
        Route::patch('/iot/devices/{device}', [AdminController::class, 'updateDevice']);
        Route::get('/SystemeIoT', [AdminController::class, 'devices']);
        Route::patch('/SystemeIoT/{device}', [AdminController::class, 'updateDevice']);
    });
});
