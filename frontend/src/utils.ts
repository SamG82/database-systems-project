export const formatTime = (time: string | undefined): string => {
    if (time === undefined) { return "" }
    const split_str = time.split(":")
    let hours = split_str[0]
    let minutes = split_str[1]
    let suffix = "AM"

    if (Number(hours) < 10) {
        hours = hours.replace('0', '')
    }

    if (Number(hours) > 12) {
        hours = String(Number(hours) - 12)
        suffix = "PM"
    } else if (Number(hours) == 12) {
        suffix = "PM"
    }
    return `${hours}:${minutes} ${suffix}`
}