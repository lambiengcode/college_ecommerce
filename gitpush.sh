
#!/bin/bash
git add .
read -p "input message: " mess
git commit -m "$mess"
git push
