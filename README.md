# File Manager

TASK: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/file-manager/assignment.md

```bash
# starts file manager
npm run start -- --username=THE_BEST_REVIEWER

# prints all commands with it's description
-h, -help

# prints particular command with it's description and example of usage
os -h 

# for enter names with spaces - quote paths
cd 'my awesome folder'
mv "my awesome file.txt" 'my favorite directory'
```

## NOTES

```bash
# groups CPUS by speed and model
os --cpus
# compress doesn't create new directory and accept any name you provide without modifying it
compress myFile.txt 'output.extension'
```