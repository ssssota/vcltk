import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";
import { tokenize } from "../tokenizer/mod.ts";
import { Parser } from "./parser.ts";

const createParser = (source: string) => new Parser(source, tokenize(source));

Deno.test("acl", () => {
  assertEquals(
    createParser("acl office_ip_ranges {}").parseDeclaration(),
    {
      kind: "acl",
      name: "office_ip_ranges",
      entries: [],
      span: [0, 23],
    },
  );
  assertEquals(
    createParser(`
      acl office_ip_ranges {
        "192.0.2.0" / 24;                            # internal office...
        ! "192.0.2.12";                              # ... except for the vending machine
        "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff";    # ipv6 address remote
      }
    `).parseDeclaration(),
    {
      kind: "acl",
      name: "office_ip_ranges",
      entries: [
        {
          kind: "acl-entry",
          address: "192.0.2.0",
          cidr: 24,
          negated: false,
          span: [38, 54],
        },
        {
          kind: "acl-entry",
          address: "192.0.2.12",
          cidr: 0,
          negated: true,
          span: [112, 126],
        },
        {
          kind: "acl-entry",
          address: "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff",
          cidr: 0,
          negated: false,
          span: [202, 242],
        },
      ],
      span: [7, 276],
    },
  );
});

Deno.test("acl entry", () => {
  assertEquals(
    createParser('"192.168.0.1"').parseAclEntry(),
    {
      kind: "acl-entry",
      address: "192.168.0.1",
      cidr: 0,
      negated: false,
      span: [0, 13],
    },
  );
  assertEquals(
    createParser('! "2001:db8::ffff"').parseAclEntry(),
    {
      kind: "acl-entry",
      address: "2001:db8::ffff",
      cidr: 0,
      negated: true,
      span: [0, 18],
    },
  );
  assertEquals(
    createParser('! "192.168.0.1" / 24').parseAclEntry(),
    {
      kind: "acl-entry",
      address: "192.168.0.1",
      cidr: 24,
      negated: true,
      span: [0, 20],
    },
  );
});

Deno.test("string", () => {
  assertEquals(createParser('"192.168.0.1"').parseString(), "192.168.0.1");
  assertEquals(createParser('{""}').parseString(), "");
  assertEquals(createParser('{EOS"Hello"EOS}').parseString(), "Hello");
});
