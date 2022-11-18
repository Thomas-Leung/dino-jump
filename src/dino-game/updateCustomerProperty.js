export function getCustomProperty(elem, prop) {
    // get css variable from the element and get the property value
    // which return a string, so we convert to float, if no value then return 0
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}

export function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value)
}

// inc: increment value
export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)

}