# 🚀 Quick Setup Commands

Run these commands in order to activate the Production Readiness System:

## Step 1: Stage All New Files

```powershell
cd G:\OEM_website
git add .coderabbit.yml
git add .github/workflows/readiness-report.yml
git add .github/workflows/codeql-analysis.yml
git add README.md
git add PRODUCTION_READINESS.md
```

## Step 2: Commit Changes

```powershell
git commit -m "Enable CodeRabbit Production Readiness System"
```

## Step 3: Push to GitHub

```powershell
git push origin main
```

## Step 4: Test the System (Optional)

Create a test branch to verify everything works:

```powershell
git checkout -b feature/test-readiness
echo "test readiness setup" >> README.md
git add README.md
git commit -m "Test CodeRabbit Production Readiness"
git push origin feature/test-readiness
```

Then:
1. Go to GitHub and create a Pull Request for `feature/test-readiness`
2. Within 2 minutes, CodeRabbit should post a review comment
3. Merge the PR → GitHub Action will auto-generate `/reports/readiness-report.md`

## ✅ Verification

After pushing, verify:
- ✅ CodeRabbit app is installed in GitHub repository settings
- ✅ GitHub Actions are enabled in repository settings
- ✅ Check the "Actions" tab for workflow runs
- ✅ Check the "Security" tab for CodeQL results

---

**Note**: If you haven't installed the CodeRabbit GitHub app yet, you'll need to:
1. Go to https://github.com/apps/coderabbitai
2. Click "Install"
3. Select your repository
4. Grant necessary permissions

