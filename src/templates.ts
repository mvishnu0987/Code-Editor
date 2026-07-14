import type { Language } from './types';

export const LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    pistonId: 'python',
    version: '3.10.0',
    fileName: 'main.py'
  },
  {
    id: 'java',
    name: 'Java',
    extension: 'java',
    pistonId: 'java',
    version: '15.0.2',
    fileName: 'Main.java'
  },
  {
    id: 'c',
    name: 'C',
    extension: 'c',
    pistonId: 'c',
    version: '10.2.0',
    fileName: 'main.c'
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    pistonId: 'cpp',
    version: '10.2.0',
    fileName: 'main.cpp'
  }
];

export const TEMPLATES: Record<string, string> = {
  python: `# Python starter code
def greet(name):
    return f"Hello, {name}! Welcome to the online Python editor."

# Read name from standard input (stdin)
print("Please enter your name:")
try:
    user_name = input()
    print(greet(user_name))
except EOFError:
    print(greet("Developer"))

# Let's perform some list operations
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Original numbers: {numbers}")
print(f"Squared numbers: {squared}")
`,

  java: `// Java starter code
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your username: ");
        
        if (scanner.hasNextLine()) {
            String name = scanner.nextLine();
            System.out.println("Welcome, " + name + "! Execution succeeded.");
        } else {
            System.out.println("Welcome, Developer! (No stdin provided)");
        }
        
        // Demo calculations
        int a = 10;
        int b = 20;
        System.out.println("Sum of " + a + " and " + b + " is: " + (a + b));
        
        scanner.close();
    }
}
`,

  c: `// C starter code
#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello from C compilation engine!\\n");
    
    char name[50];
    printf("Enter your name: ");
    
    // Read stdin
    if (fgets(name, sizeof(name), stdin)) {
        // Remove trailing newline character
        name[strcspn(name, "\\n")] = 0;
        printf("Greetings, %s! Code executed successfully.\\n", name);
    } else {
        printf("Greetings, Developer! (No stdin provided)\\n");
    }
    
    // Simple math check
    int limit = 5;
    printf("Printing numbers 1 to %d:\\n", limit);
    for(int i = 1; i <= limit; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    
    return 0;
}
`,

  cpp: `// C++ starter code
#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    cout << "Hello from C++ (g++) execution environment!" << endl;
    
    string name;
    cout << "Enter your name: ";
    
    if (getline(cin, name)) {
        cout << "Welcome back, " << name << "!" << endl;
    } else {
        cout << "Welcome, Developer! (No stdin provided)" << endl;
    }
    
    // Using modern C++ vectors
    vector<string> items = {"Compile", "Run", "Interactive Input", "History Logs"};
    cout << "Editor Features:" << endl;
    for (const auto& item : items) {
        cout << " - " << item << endl;
    }
    
    return 0;
}
`
};
