import Ajv from 'ajv';
import ValidationError from '../errors/validation-error';
import profileSchema from '../../schema/users/profile.json';
import createUserSchame from '../../schema/users/create.json';
import generateValidationErrorMessage from '../errors/messages';

function validate(req) {
    const ajvValidate = new Ajv()
        .addFormat('email', /^[w.+]+@\w+\.\w+$/)
        .addSchema([profileSchema, createUserSchame])
        .compile(createUserSchame);

    const valid = ajvValidate(req.body);
    if (!valid) {
        return new ValidationError(generateValidationErrorMessage(ajvValidate.errors));
    }
    return true;
}
export default validate;
