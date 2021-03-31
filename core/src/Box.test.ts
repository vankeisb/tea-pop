import { box, pos, dim } from ".";

describe('Box tests', () => {
    const myBox = box(pos(10, 10), dim(10, 10));

    it('Point inside', () => {
        [
            [ 0, 15 ], // x before
            [ 25, 15 ], // x after
            [ 15, 0 ], // y before
            [ 15, 25 ], // y after
        ].forEach(([x, y]) => 
            expect(myBox.isPointInside(pos(x, y))).toBe(false)
        );
        
        expect(myBox.isPointInside(pos(15, 15))).toBe(true);
    })

    it('Box inside', () => {
        [
            [ 0, 15, 1, 1 ], // x before
            [ 25, 15, 1, 1 ], // x after
            [ 15, 0, 1, 1 ], // y before
            [ 15, 25, 1, 1 ], // y after
            [ 15, 15, 10, 1 ], // bigger
            [ 15, 15, 1, 10 ], // bigger
        ].forEach(([x, y, w, h]) => 
            expect(myBox.isBoxInside(box(pos(x, y), dim(w, h)))).toBe(false)
        );
        
        expect(myBox.isBoxInside(box(pos(15, 15), dim(5, 5)))).toBe(true);
    })
})