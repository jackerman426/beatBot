/**
 *  @fileoverview Chat API. Chats with the user
 *                General Usage
 *                -------------
 *                Say something
 *                Echo something
 *
 *  @author       Marios Tzakris
 */



const actions = {
    echo: echo, //repeats a phrase
    say: say, //repeats a phrase
};



// -----------------------------------------------------------------------------
/** Choose what action to perform.
 * @method resolve
 * @param {String} action - fb event object.
 * @param {String} text - info
 * @param {Object} next
 */
// -----------------------------------------------------------------------------
function resolve (action, text, next) {
    if(actions[action])
        actions[action](text, function (error, replyText) {
            return next(error, replyText)
        });
}

// -----------------------------------------------------------------------------
/** Echo a phrase
 * @method echo
 * @param {Object} next
 * @param {String} text - info
 */
// -----------------------------------------------------------------------------
function echo (text, next) {
    if(text){
        return next(null, text);
    } else {
        return next(null, 'What do you want me to say dude?')
    }
}

// -----------------------------------------------------------------------------
/** Say a phrase
 * @method echo
 * @param {Object} next
 * @param {String} text - info
 */
// -----------------------------------------------------------------------------
function say (text, next) {
    if(text){
        return next(null, text);
    } else {
        return next(null, 'What do you want me to say dude?')
    }
}


module.exports = {
    resolve: resolve
};