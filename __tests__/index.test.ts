import { describe, expect, it } from "bun:test";
import { z } from "zod"
import { mock } from "mocktools";

describe("mocktools", () => {

    it("works with strings", () => {

        type TestString = string

        const [mockValue] = mock<TestString[]>("TestString", () => [], {
            length: 10,
        });
        expect(z.string().parse(mockValue)).not.fail();
    });
    it("works with tuples", () => {

        type TestTuple = [string, string]

        const [mockValue] = mock<TestTuple[]>("TestTuple", () => [], {
            length: 10,
        });
        expect(z.tuple([
            z.string(),
            z.string(),
        ]).parse(mockValue)).not.fail();
    });
    it("works with arrays with at least 3 items", () => {

        type TestArr = [boolean, boolean, boolean, ...boolean[]];

        const [mockValue] = mock<TestArr[]>("TestArr", () => [], {
            length: 10,
        });
        expect(mockValue.length).toBeGreaterThanOrEqual(3);
        expect(mockValue.every(i => typeof i === "boolean")).toBe(true);
    });
    it("works with dates", () => {

        type TestDate = Date

        const [mockValue] = mock<TestDate[]>("TestDate", () => [], {
            length: 10,
        });
        expect(z.date().parse(mockValue)).not.fail();
    });
    it("works with object values that are undefined", () => {

        type TestObj = {
            unknownKey: undefined;
        }
        const [mockValue] = mock<TestObj[]>("TestObj", () => [], {
            length: 10,
        });
        expect(mockValue.unknownKey).toBe(undefined);
    });
    it("works with mapped types", () => {

        type TestMappedType = {
            [key: string]: boolean
        }
        const [mockValue] = mock<TestMappedType[]>("MappedType", () => [], {
            length: 10,
        });
        expect(Object.entries(mockValue).every(([key, value]) => typeof key === "string" && typeof value === "boolean")).toBe(true);
    });
    it("works with inferred zod objects", () => {

        const zodObj = z.object({
            item: z.string(),
        });
        type TestZodObj = z.infer<typeof zodObj>;
    
        const [mockValue] = mock<TestZodObj[]>("ZodObj", () => [], {
            length: 10,
        });
        expect(zodObj.parse(mockValue)).not.fail();
    });
});