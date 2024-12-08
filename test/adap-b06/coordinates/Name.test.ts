import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    let newN = n.insert(1, "cs");
    expect(newN.asString()).toBe("oss.cs.fau.de");
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    let newN = n.append("de");
    expect(newN.asString()).toBe("oss.cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let newN = n.remove(0);
    expect(newN.asString()).toBe("cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    let newN = n.insert(1, "cs");
    expect(newN.asString()).toBe("oss.cs.fau.de");
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    let newN = n.append("de");
    expect(newN.asString()).toBe("oss.cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let newN = n.remove(0);
    expect(newN.asString()).toBe("cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    let newN = n.insert(1, "cs");
    expect(newN.asString()).toBe("oss#cs#fau#de");
    expect(n.asString()).toBe("oss#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    let newN = n.append("people");
    expect(newN.asString()).toBe("oss.cs.fau.de#people");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Empty name tests", () => {
  it("test empty name", () => {
    let n: Name = new StringName("");
    let newN = n.remove(0);
    expect(n.isEmpty()).toBe(false);
    expect(newN.isEmpty()).toBe(true);
    let appended = n.append("oss");
    expect(appended.isEmpty()).toBe(false);
    expect(n.isEmpty()).toBe(false);
  });
});

describe("Concatenation tests", () => {
  it("test concatenation", () => {
    let n1: Name = new StringName("oss");
    let n2: Name = new StringName("cs.fau.de");
    let concatenated = n1.concat(n2);
    expect(concatenated.asString()).toBe("oss.cs.fau.de");
    expect(n1.asString()).toBe("oss");
    expect(n2.asString()).toBe("cs.fau.de");
  });
});

describe("Equality tests", () => {
  it("test equality", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.isEqual(n2)).toBe(true);
    let modifiedN2 = n2.remove(0);
    expect(n1.isEqual(modifiedN2)).toBe(false);
    expect(n2.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Hash code tests", () => {
  it("test hash code", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.getHashCode()).toBe(n2.getHashCode());
    let modifiedN2 = n2.remove(0);
    expect(n1.getHashCode()).not.toBe(modifiedN2.getHashCode());
  });
});

describe("Delimiter function tests for StringArrayName", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], '#');
    let newN = n.insert(1, "cs");
    expect(newN.asString()).toBe("oss#cs#fau#de");
    expect(n.asString()).toBe("oss#fau#de");
  });
});

describe("Escape character extravaganza for StringArrayName", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n.getNoComponents()).toBe(4);
    expect(n.asString()).toBe("oss#cs#fau#de");
    let newN = n.append("people");
    expect(newN.asString(".")).toBe("oss.cs.fau.de.people");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Empty name tests for StringArrayName", () => {
  it("test empty name", () => {
    let n: Name = new StringArrayName([], '#');
    expect(n.isEmpty()).toBe(true);

    let newN = n.append("oss");
    expect(newN.isEmpty()).toBe(false);
    expect(n.isEmpty()).toBe(true);
  });
});

describe("Concatenation tests for StringArrayName", () => {
  it("test concatenation", () => {
    let n1: Name = new StringArrayName(["oss"], '#');
    let n2: Name = new StringArrayName(["cs", "fau", "de"], '.');
    let concatenated = n1.concat(n2);

    expect(concatenated.asString()).toBe("oss#cs#fau#de");
    expect(n1.asString()).toBe("oss");
    expect(n2.asString()).toBe("cs.fau.de");
  });
});

describe("Equality tests for StringArrayName", () => {
  it("test equality", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n1.isEqual(n2)).toBe(true);

    let modifiedN2 = n2.remove(0);
    expect(n1.isEqual(modifiedN2)).toBe(false);
    expect(n2.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Equality2", () => {
  it("StringName", () => {
    let n1 = new StringName("oss.cs.fau.de");
    let n2 = n1.append("people").remove(4);
    expect(n1.isEqual(n2)).toBe(true);
  });

  it("StringArrayName", () => {
    let n1 = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2 = n1.append("people").remove(4);
    expect(n1.isEqual(n2)).toBe(true);
  });
});

describe("Hash code tests for StringArrayName", () => {
  it("test hash code", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n1.getHashCode()).toBe(n2.getHashCode());

    let modifiedN2 = n2.remove(0);
    expect(modifiedN2.getHashCode()).not.toBe(n1.getHashCode()); // Hash codes differ for different objects
    expect(n2.getHashCode()).toBe(n1.getHashCode()); // Original n2 remains unchanged
  });
});


describe("Test Precondition Stringname", () => {
  it("test Exceptions", () => {
    expect(() => new StringName("Hans", "Peter")).toThrowError()
    let n: Name = new StringName("Hallo\.Peter")
    expect(() => n.asString("Hallo")).toThrowError()
    expect(() => n.getComponent(-10)).toThrowError()
    expect(() => n.getComponent(10)).toThrowError()
    expect(() => n.setComponent(-10, "Hall")).toThrowError()
    expect(() => n.setComponent(10, "Hallo")).toThrowError()
    expect(() => n.setComponent(1, "Hal.lo")).toThrowError()
    expect(() => n.insert(-10, "Hall")).toThrowError()
    expect(() => n.insert(10, "Hallo")).toThrowError()
    expect(() => n.insert(1, "Hal.lo")).toThrowError()
    expect(() => n.remove(-10)).toThrowError()
    expect(() => n.remove(10)).toThrowError()
  })
})


describe("Test Precondition StringArrayName", () => {
  it("test Exceptions", () => {
    expect(() => new StringArrayName(["Hans"], "Peter")).toThrowError()
    let n: Name = new StringArrayName(["Hallo", "Peter"])
    expect(() => n.asString("Hallo")).toThrowError()
    expect(() => n.getComponent(-10)).toThrowError()
    expect(() => n.getComponent(10)).toThrowError()
    expect(() => n.setComponent(-10, "Hall")).toThrowError()
    expect(() => n.setComponent(10, "Hallo")).toThrowError()
    expect(() => n.setComponent(1, "Hal.lo")).toThrowError()
    expect(() => n.insert(-10, "Hall")).toThrowError()
    expect(() => n.insert(10, "Hallo")).toThrowError()
    expect(() => n.insert(1, "Hal.lo")).toThrowError()
    expect(() => n.remove(-10)).toThrowError()
    expect(() => n.remove(10)).toThrowError()
  })
})


describe("Equality test", () => {
  it("test isEqual", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.getHashCode() == n2.getHashCode()).toBe(true);

    n1 = n1.setComponent(1, "test");
    n2 = n2.setComponent(1, "test");
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.getHashCode() == n2.getHashCode()).toBe(true);

    n1 = n1.setComponent(2, "test");
    n2 = n2.setComponent(2, "test2");
    expect(n1.isEqual(n2)).toBe(false);
    expect(n1.getHashCode() == n2.getHashCode()).toBe(false);
  });
});




