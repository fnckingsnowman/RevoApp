#include <windows.h>
#include <iostream>
#include <cctype>

HHOOK keyboardHook;
int f11Counter = 0;
int f12Counter = 0;
char f11OutputKey;
char f12OutputKey;

LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
    if (nCode >= 0 && wParam == WM_KEYDOWN) {
        KBDLLHOOKSTRUCT* kbStruct = (KBDLLHOOKSTRUCT*)lParam;
        if (kbStruct->vkCode == VK_F11) {
            f11Counter++;
            if (f11Counter == 12) {
                // Reset counter
                f11Counter = 0;

                // Simulate pressing the desired key for F11
                INPUT input;
                input.type = INPUT_KEYBOARD;
                input.ki.wVk = toupper(f11OutputKey);
                input.ki.wScan = 0;
                input.ki.dwFlags = 0; // 0 for key press
                input.ki.time = 0;
                input.ki.dwExtraInfo = 0;
                SendInput(1, &input, sizeof(INPUT));

                // Release the keygh
                input.ki.dwFlags = KEYEVENTF_KEYUP; // for key release
                SendInput(1, &input, sizeof(INPUT));

                // Block the original key press
                return 1;
            }
        } else if (kbStruct->vkCode == VK_F12) {
            f12Counter++;
            if (f12Counter == 12) {
                // Reset counter
                f12Counter = 0;

                // Simulate pressing the desired key for F12
                INPUT input;
                input.type = INPUT_KEYBOARD;
                input.ki.wVk = toupper(f12OutputKey);
                input.ki.wScan = 0;
                input.ki.dwFlags = 0; // 0 for key press
                input.ki.time = 0;
                input.ki.dwExtraInfo = 0;
                SendInput(1, &input, sizeof(INPUT));

                // Release the key
                input.ki.dwFlags = KEYEVENTF_KEYUP; // for key release
                SendInput(1, &input, sizeof(INPUT));

                // Block the original key press
                return 1;
            }
        }
    }
    return CallNextHookEx(keyboardHook, nCode, wParam, lParam);
}

void SetKeyboardHook() {
    if (!(keyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0))) {
        std::cerr << "Failed to install keyboard hook!" << std::endl;
    }
}

void UnhookKeyboard() {
    UnhookWindowsHookEx(keyboardHook);
}

int main() {
    std::cout << "Enter the desired output key for F11: ";
    std::cin >> f11OutputKey;
    f11OutputKey = toupper(f11OutputKey); // Convert to uppercase to match virtual key codes

    std::cout << "Enter the desired output key for F12: ";
    std::cin >> f12OutputKey;
    f12OutputKey = toupper(f12OutputKey); // Convert to uppercase to match virtual key codes

    MSG msg;

    SetKeyboardHook();

    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    UnhookKeyboard();
    return 0;
}
