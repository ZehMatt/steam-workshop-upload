const process = require('process')
const fs = require('fs')
const child_process = require('child_process')

const REQUIRED_ENV = ['STEAM_USERNAME', 'STEAM_PASSWORD', 'appid', 'fileid', 'path',]

for (const env in REQUIRED_ENV) {
    if (!process.env[REQUIRED_ENV[env]]) {
        console.log(`Environment variable ${REQUIRED_ENV[env]} is required but not provided.`)
        process.exit(1)
    }
}

const WORKSHOPVDF = `
"workshopitem"
{
    "appid" "${process.env.appid}"
    "publishedfileid" "${process.env.fileid}"
    "contentfolder"    "${process.env.repo}/${process.env.path}"
    "changenote" "${process.env.changenote}"
}
`

fs.writeFileSync('/home/steam/workshop.vdf', WORKSHOPVDF)

if (process.env.STEAM_TFASEED) {
    child_process.spawn('/home/steam/steamcmd-2fa', [`--username ${process.env.STEAM_USERNAME}`, `--password ${process.env.STEAM_PASSWORD}`, `--seed ${process.env.STEAM_TFASEED}`, `--args "+workshop_build_item /home/steam/workshop.vdf +quit"`],
    {
        stdio: 'inherit'
    })
} else {
    child_process.spawn('/home/steam/steamcmd.sh', [`+login ${process.env.STEAM_USERNAME} ${process.env.STEAM_PASSWORD}+workshop_build_item /home/steam/workshop.vdf +quit`],
    {
        stdio: 'inherit'
    })
}
