const dotenv = require('dotenv')
const dotenvParseVariables = require('dotenv-parse-variables')
 
let env = dotenv.config({ path: path.join(__dirname, '../../.env') })
    env = dotenvParseVariables(env.parsed)
