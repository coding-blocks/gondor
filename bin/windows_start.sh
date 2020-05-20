rm -rf ".\app\pages\api"
rm -rf ".\pages"
ln -s ".\api\routes" ".\app\pages\api"
ln -s ".\app\pages" ".\pages"