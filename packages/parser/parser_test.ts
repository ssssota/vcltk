import { assertEquals } from "https://deno.land/std@0.217.0/assert/assert_equals.ts";
import { tokenize } from "../tokenizer/mod.ts";
import { Parser } from "./parser.ts";

const createParser = (source: string) => new Parser(source, tokenize(source));

Deno.test("ACL", () => {
  const source = `acl office_ip_ranges {
  "192.0.2.0"/24;                              # internal office...
  ! "192.0.2.12";                              # ... except for the vending machine
  "198.51.100.4";                              # remote VPN office
  "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff";    # ipv6 address remote
}`;
  const parser = createParser(source);
  assertEquals(
    parser.parse(),
    {
      kind: "vcl",
      declarations: [
        {
          entries: [
            {
              address: "192.0.2.0",
              cidr: 24,
              kind: "acl-entry",
              negated: false,
              span: [25, 39],
            },
            {
              address: "192.0.2.12",
              cidr: 0,
              kind: "acl-entry",
              negated: true,
              span: [93, 107],
            },
            {
              address: "198.51.100.4",
              cidr: 0,
              kind: "acl-entry",
              negated: false,
              span: [177, 191],
            },
            {
              address: "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff",
              cidr: 0,
              kind: "acl-entry",
              negated: false,
              span: [244, 284],
            },
          ],
          kind: "acl",
          name: "office_ip_ranges",
          span: [0, 312],
        },
      ],
      span: [0, 312],
    },
  );
  assertEquals(parser.comments, [
    "# internal office...",
    "# ... except for the vending machine",
    "# remote VPN office",
    "# ipv6 address remote",
  ]);
});

Deno.test("Backend", () => {
  // TODO: handle always keyword
  const source = `backend backend_name {

  # Required to be set for all VCL defined backends
  .dynamic = true;
  .share_key = "YOUR_SERVICE_ID";

  # Server location
  .host = "storage.googleapis.com";
  .port = "443";
  .ssl = true;
  .ssl_cert_hostname = "storage.googleapis.com";
  // .ssl_check_cert = always;
  .ssl_sni_hostname = "storage.googleapis.com";

  # Timeouts and limits
  .between_bytes_timeout = 10s;
  .connect_timeout = 1s;
  .first_byte_timeout = 15s;
  .max_connections = 200;

  // # Host header override
  // .host_header = "storage.googleapis.com";
  // .always_use_host_header = true;

  // # Protected properties
  // .bypass_local_route_table = true;

  // # Health check
  // .probe = {
  //   .dummy = false; # Boolean value determines the behavior of the probe.
  //                   # \`true\` performs DNS lookups only.
  //                   # \`false\` performs DNS lookups and HTTP health checks.
  //   .request = "HEAD / HTTP/1.1"  "Host: storage.googleapis.com" "Connection: close";
  //   .expected_response = 200;
  //   .interval = 60s;   # Send a check every 60s
  //   .timeout = 2s;     # Allow up to 2s for the backend to respond to the check
  //   .window = 5;       # Keep a history of 5 checks
  //   .initial = 4;      # Start with 4 successful checks in the history
  //   .threshold = 4;    # 4 of the recent checks must be successful for backend to be healthy
  // }
}`;
  const parser = createParser(source);
  assertEquals(
    parser.parse(),
    {
      kind: "vcl",
      declarations: [
        {
          kind: "backend",
          name: "backend_name",
          properties: [
            {
              key: "dynamic",
              kind: "object-property",
              span: [78, 93],
              value: { kind: "bool", span: [89, 93], value: true },
            },
            {
              key: "share_key",
              kind: "object-property",
              span: [97, 127],
              value: {
                kind: "string",
                span: [110, 127],
                tokens: ["YOUR_SERVICE_ID"],
              },
            },
            {
              key: "host",
              kind: "object-property",
              span: [152, 184],
              value: {
                kind: "string",
                span: [160, 184],
                tokens: ["storage.googleapis.com"],
              },
            },
            {
              key: "port",
              kind: "object-property",
              span: [188, 201],
              value: { kind: "string", span: [196, 201], tokens: ["443"] },
            },
            {
              key: "ssl",
              kind: "object-property",
              span: [205, 216],
              value: { kind: "bool", span: [212, 216], value: true },
            },
            {
              key: "ssl_cert_hostname",
              kind: "object-property",
              span: [220, 265],
              value: {
                kind: "string",
                span: [241, 265],
                tokens: ["storage.googleapis.com"],
              },
            },
            {
              key: "ssl_sni_hostname",
              kind: "object-property",
              span: [300, 344],
              value: {
                kind: "string",
                span: [320, 344],
                tokens: ["storage.googleapis.com"],
              },
            },
            {
              key: "between_bytes_timeout",
              kind: "object-property",
              span: [373, 401],
              value: { kind: "rtime", ns: 10000000000n, span: [398, 401] },
            },
            {
              key: "connect_timeout",
              kind: "object-property",
              span: [405, 426],
              value: { kind: "rtime", ns: 1000000000n, span: [424, 426] },
            },
            {
              key: "first_byte_timeout",
              kind: "object-property",
              span: [430, 455],
              value: { kind: "rtime", ns: 15000000000n, span: [452, 455] },
            },
            {
              key: "max_connections",
              kind: "object-property",
              span: [459, 481],
              value: { kind: "integer", span: [478, 481], value: 200n },
            },
          ],
          span: [0, 1403],
        },
      ],
      span: [0, 1403],
    },
  );
  assertEquals(parser.comments, [
    "# Required to be set for all VCL defined backends",
    "# Server location",
    "// .ssl_check_cert = always;",
    "# Timeouts and limits",
    "// # Host header override",
    '// .host_header = "storage.googleapis.com";',
    "// .always_use_host_header = true;",
    "// # Protected properties",
    "// .bypass_local_route_table = true;",
    "// # Health check",
    "// .probe = {",
    "//   .dummy = false; # Boolean value determines the behavior of the probe.",
    "//                   # `true` performs DNS lookups only.",
    "//                   # `false` performs DNS lookups and HTTP health checks.",
    '//   .request = "HEAD / HTTP/1.1"  "Host: storage.googleapis.com" "Connection: close";',
    "//   .expected_response = 200;",
    "//   .interval = 60s;   # Send a check every 60s",
    "//   .timeout = 2s;     # Allow up to 2s for the backend to respond to the check",
    "//   .window = 5;       # Keep a history of 5 checks",
    "//   .initial = 4;      # Start with 4 successful checks in the history",
    "//   .threshold = 4;    # 4 of the recent checks must be successful for backend to be healthy",
    "// }",
  ]);
});

// TODO: handle director
// Deno.test("Director", () => {
//   const source = `director the_hash_dir hash {
//   .quorum=20%;
//   { .backend=F_origin_0; .weight=1; }
//   { .backend=F_origin_1; .weight=1; }
//   { .backend=F_origin_2; .weight=1; }
// }`;
//   const parser = createParser(source);
//   assertEquals(
//     parser.parse(),
//     { kind: "vcl", declarations: [], span: [0, 0] },
//   );
// });

Deno.test("Penaltybox", () => {
  const source = `penaltybox banned_users {
  # no properties
}`;
  const parser = createParser(source);
  assertEquals(
    parser.parse(),
    {
      kind: "vcl",
      declarations: [{
        kind: "penaltybox",
        name: "banned_users",
        span: [0, 45],
      }],
      span: [0, 45],
    },
  );
  assertEquals(parser.comments, ["# no properties"]);
});

Deno.test("Ratecounter", () => {
  const source = `ratecounter requests_rate {
  # no properties
}`;
  const parser = createParser(source);
  assertEquals(
    parser.parse(),
    {
      kind: "vcl",
      declarations: [{
        kind: "ratecounter",
        name: "requests_rate",
        span: [0, 47],
      }],
      span: [0, 47],
    },
  );
  assertEquals(parser.comments, ["# no properties"]);
});

// TODO: handle subroutine
Deno.test("Subroutine", () => {});

Deno.test("Table", () => {
  const source = `table redirects {
  "/old/path": "https://other.hostname/new/path",
  "/another/path": "/new/path",
}
table routing_table BACKEND {
  "a.example.com": b0,
  "b.example.com": b1,
  "c.example.com": b2,
}`;
  const parser = createParser(source);
  assertEquals(
    parser.parse(),
    {
      kind: "vcl",
      declarations: [
        {
          kind: "table",
          name: "redirects",
          type: undefined,
          entries: [
            {
              key: { kind: "string", span: [20, 31], tokens: ["/old/path"] },
              kind: "table-entry",
              span: [20, 66],
              value: {
                kind: "string",
                span: [33, 66],
                tokens: ["https://other.hostname/new/path"],
              },
            },
            {
              key: {
                kind: "string",
                span: [70, 85],
                tokens: ["/another/path"],
              },
              kind: "table-entry",
              span: [70, 98],
              value: { kind: "string", span: [87, 98], tokens: ["/new/path"] },
            },
          ],
          span: [0, 101],
        },
        {
          kind: "table",
          name: "routing_table",
          type: { kind: "BACKEND", span: [122, 129] },
          entries: [
            {
              key: {
                kind: "string",
                span: [134, 149],
                tokens: ["a.example.com"],
              },
              kind: "table-entry",
              span: [134, 153],
              value: {
                kind: "variable",
                name: "b0",
                properties: [],
                span: [151, 153],
                subField: undefined,
              },
            },
            {
              key: {
                kind: "string",
                span: [157, 172],
                tokens: ["b.example.com"],
              },
              kind: "table-entry",
              span: [157, 176],
              value: {
                kind: "variable",
                name: "b1",
                properties: [],
                span: [174, 176],
                subField: undefined,
              },
            },
            {
              key: {
                kind: "string",
                span: [180, 195],
                tokens: ["c.example.com"],
              },
              kind: "table-entry",
              span: [180, 199],
              value: {
                kind: "variable",
                name: "b2",
                properties: [],
                span: [197, 199],
                subField: undefined,
              },
            },
          ],
          span: [102, 202],
        },
      ],
      span: [0, 202],
    },
  );
});
