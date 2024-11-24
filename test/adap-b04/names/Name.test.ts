import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import exp from "constants";
import { InvalidStateException } from "../common/InvalidStateException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss\.fau\.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Empty name tests", () => {
  it("test empty name", () => {
    let n: Name = new StringName("")
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    n.append("oss");
    expect(n.isEmpty()).toBe(false);
  });
});

describe("Concatenation tests", () => {
  it("test concatenation", () => {
    let n1: Name = new StringName("oss");
    let n2: Name = new StringName("cs.fau.de");
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Equality tests", () => {
  it("test equality", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.isEqual(n2)).toBe(true);
    n2.remove(0);
    expect(n1.isEqual(n2)).toBe(false);
  });
});

describe("Clone tests", () => {
  it("test clone", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = n1.clone() as Name;
    expect(n1.isEqual(n2)).toBe(true);
    n2.remove(0);
    expect(n1.isEqual(n2)).toBe(false);
  });
});

describe("Hash code tests", () => {
  it("test hash code", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.getHashCode()).toBe(n2.getHashCode());
    n2.remove(0);
    expect(n1.getHashCode()).not.toBe(n2.getHashCode());
  });
});

describe("Delimiter function tests for StringArrayName", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza for StringArrayName", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n.getNoComponents()).toBe(4);
    expect(n.asString()).toBe("oss#cs#fau#de");
    n.append("people");
    expect(n.asString(".")).toBe("oss.cs.fau.de.people");
  });
});

describe("Empty name tests for StringArrayName", () => {
  it("test empty name", () => {
    let n: Name = new StringArrayName([], '#')
    expect(n.isEmpty()).toBe(true);
    n.append("oss");
    expect(n.isEmpty()).toBe(false);
  });
});

describe("Concatenation tests for StringArrayName", () => {
  it("test concatenation", () => {
    let n1: Name = new StringArrayName(["oss"], '#');
    let n2: Name = new StringArrayName(["cs", "fau", "de"], '.');
    n1.concat(n2);
    expect(n1.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Equality tests for StringArrayName", () => {
  it("test equality", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n1.isEqual(n2)).toBe(true);
    n2.remove(0);
    expect(n1.isEqual(n2)).toBe(false);
  });
});

describe("Clone tests for StringArrayName", () => {
  it("test clone", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    let n2: Name = n1.clone() as Name;
    expect(n1.isEqual(n2)).toBe(true);
    n2.remove(0);
    // only shallow copy
    expect(n1.isEqual(n2)).toBe(true);
  });
});

describe("Hash code tests for StringArrayName", () => {
  it("test hash code", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], '#');
    expect(n1.getHashCode()).toBe(n2.getHashCode());
    n2.remove(0);
    expect(n1.getHashCode()).not.toBe(n2.getHashCode());
  });
});

describe("Test Precondition Stringname", () => {
  it ("test Exceptions", () => {
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
  it ("test Exceptions", () => {
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







