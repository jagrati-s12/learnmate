with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/MockTestPage.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# find where "return (\n      <>\n        <Topbar title=\"Test Results\" />" is
start_idx = -1
for i, line in enumerate(lines):
    if "Topbar title=\"Test Results\"" in line:
        # the return ( and <> are just before this
        start_idx = i - 2
        break

# find the end of this return block
end_idx = -1
if start_idx != -1:
    for i in range(start_idx, len(lines)):
        if "Dash" in lines[i] and "board" in lines[i] and "</Button>" in lines[i+1]:
            # This is the Go to Dashboard button
            end_idx = i + 5
            break

if start_idx != -1 and end_idx != -1:
    del lines[start_idx:end_idx]
    
with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/MockTestPage.tsx", "w", encoding="utf-8") as f:
    f.writelines(lines)
print("done")
