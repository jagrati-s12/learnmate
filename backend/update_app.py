import re

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/App.tsx", "r") as f:
    content = f.read()

# Add the import
content = content.replace("import { MockTestPage } from './pages/student/MockTestPage';", "import { MockTestPage } from './pages/student/MockTestPage';\nimport { MockTestsListPage } from './pages/student/MockTestsListPage';")

# Update routes
content = content.replace("<Route path=\"/tests\" element={<MockTestPage />} />", "<Route path=\"/tests\" element={<MockTestsListPage />} />")

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/App.tsx", "w") as f:
    f.write(content)

print("Updated App.tsx")
