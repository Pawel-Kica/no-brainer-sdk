commit_message="Update: version $(date +%d-%m-%Y)"
npm run build
git add .
git commit -m "$commit_message"
npm version patch
git push
npm run build
npm publish