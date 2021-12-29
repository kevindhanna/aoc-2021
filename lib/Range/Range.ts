export class Range {
    start: number;
    end: number;
    length: number;
    private current = 0;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
        this.length = end - start + 1;
    }
    [Symbol.iterator]() {
        this.current = 0;
        return {
            next: () => {
                const done = this.start + this.current > this.end;
                const val = {
                    value: done ? null : this.start + this.current,
                    done: done,
                }
                ++this.current;
                return val;
            }
        }
    }
    overlaps(that: Range): boolean {
        const [low, high] = this.end < that.end ? [this,that] : [that,this];
        return high.start <= low.end;
    }

    public static intersection(a: Range, b: Range): Range {
        const start = a.start < b.start ? b.start : a.start;
        const end = a.end < b.end ? a.end : b.end;
        return new Range(start, end);
    }
}
