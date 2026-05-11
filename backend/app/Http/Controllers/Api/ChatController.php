<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatIA;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => ChatIA::orderByDesc('timestamp')
                ->limit(50)
                ->get()
                ->reverse()
                ->values(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['message' => ['required', 'string', 'max:1000']]);
        $message = mb_strtolower($data['message']);

        $answer = $this->answer($message);
        $botMessage = ChatIA::create([
            'question' => $data['message'],
            'reponse' => $answer,
            'timestamp' => now(),
        ]);

        return response()->json(['data' => $botMessage], 201);
    }

    private function answer(string $message): string
    {
        if (str_contains($message, 'irrigation')) {
            return "L'irrigation est prete. Vous pouvez activer, dasactiver, evaluer ou executer.";
        }

        if (str_contains($message, 'weather') || str_contains($message, 'meteo')) {
            return "Les donnerMeteo sont disponibles depuis la derniere lecture.";
        }

        return "Je peux aider avec capteurs, reglerIrrigation, donnerMeteo, alerte et recommandations.";
    }
}
