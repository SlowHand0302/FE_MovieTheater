import { parse, format } from 'date-fns';

export function time12hTo24Hour(time12h: string): string {
    const parsed = parse(time12h, 'hh:mm a', new Date());

    if (isNaN(parsed.getTime())) {
        throw new Error('Invalid time format');
    }

    return format(parsed, 'HH:mm');
}
