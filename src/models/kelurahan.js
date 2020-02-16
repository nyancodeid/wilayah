const dotenv = require('dotenv')
const dotenvParseVariables = require('dotenv-parse-variables')
let env = dotenv.config({ path: Path.join(__dirname, '../../.env') })
    env = dotenvParseVariables(env.parsed)
