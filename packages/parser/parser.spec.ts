import { tokenize } from "@vcltk/tokenizer";
import { assert, test } from "vitest";
import { Parser } from "./parser.js";

const createParser = (source: string) => new Parser(source, tokenize(source));

test("ACL", () => {
	const source = `acl office_ip_ranges {
  "192.0.2.0"/24;                              # internal office...
  ! "192.0.2.12";                              # ... except for the vending machine
  "198.51.100.4";                              # remote VPN office
  "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff";    # ipv6 address remote
}`;
	const parser = createParser(source);
	assert.deepEqual(parser.parse(), {
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
	});
	assert.deepEqual(parser.comments, [
		"# internal office...",
		"# ... except for the vending machine",
		"# remote VPN office",
		"# ipv6 address remote",
	]);
});

test("Backend", () => {
	const source = `backend backend_name {

  # Required to be set for all VCL defined backends
  .dynamic = true;
  .share_key = "YOUR_SERVICE_ID";

  # Server location
  .host = "storage.googleapis.com";
  .port = "443";
  .ssl = true;
  .ssl_cert_hostname = "storage.googleapis.com";
  .ssl_check_cert = always;
  .ssl_sni_hostname = "storage.googleapis.com";

  # Timeouts and limits
  .between_bytes_timeout = 10s;
  .connect_timeout = 1s;
  .first_byte_timeout = 15s;
  .max_connections = 200;

  # Host header override
  .host_header = "storage.googleapis.com";
  .always_use_host_header = true;

  # Protected properties
  .bypass_local_route_table = true;

  # Health check
  .probe = {
    .dummy = false; # Boolean value determines the behavior of the probe.
                    # \`true\` performs DNS lookups only.
                    # \`false\` performs DNS lookups and HTTP health checks.
    .request = "HEAD / HTTP/1.1"  "Host: storage.googleapis.com" "Connection: close";
    .expected_response = 200;
    .interval = 60s;   # Send a check every 60s
    .timeout = 2s;     # Allow up to 2s for the backend to respond to the check
    .window = 5;       # Keep a history of 5 checks
    .initial = 4;      # Start with 4 successful checks in the history
    .threshold = 4;    # 4 of the recent checks must be successful for backend to be healthy
  }
}`;
	const parser = createParser(source);
	assert.deepEqual(parser.parse(), {
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
						key: "ssl_check_cert",
						kind: "object-property",
						span: [269, 293],
						value: {
							kind: "variable",
							name: "always",
							properties: [],
							span: [287, 293],
							subField: undefined,
						},
					},
					{
						key: "ssl_sni_hostname",
						kind: "object-property",
						span: [297, 341],
						value: {
							kind: "string",
							span: [317, 341],
							tokens: ["storage.googleapis.com"],
						},
					},
					{
						key: "between_bytes_timeout",
						kind: "object-property",
						span: [370, 398],
						value: { kind: "rtime", value: 10n, unit: "s", span: [395, 398] },
					},
					{
						key: "connect_timeout",
						kind: "object-property",
						span: [402, 423],
						value: { kind: "rtime", value: 1n, unit: "s", span: [421, 423] },
					},
					{
						key: "first_byte_timeout",
						kind: "object-property",
						span: [427, 452],
						value: { kind: "rtime", value: 15n, unit: "s", span: [449, 452] },
					},
					{
						key: "max_connections",
						kind: "object-property",
						span: [456, 478],
						value: { kind: "integer", span: [475, 478], value: 200n },
					},
					{
						key: "host_header",
						kind: "object-property",
						span: [508, 547],
						value: {
							kind: "string",
							span: [523, 547],
							tokens: ["storage.googleapis.com"],
						},
					},
					{
						key: "always_use_host_header",
						kind: "object-property",
						span: [551, 581],
						value: { kind: "bool", span: [577, 581], value: true },
					},
					{
						key: "bypass_local_route_table",
						kind: "object-property",
						span: [611, 643],
						value: { kind: "bool", span: [639, 643], value: true },
					},
					{
						key: "probe",
						kind: "object-property",
						span: [665, 1344],
						value: {
							kind: "object",
							properties: [
								{
									key: "dummy",
									kind: "object-property",
									span: [680, 694],
									value: { kind: "bool", span: [689, 694], value: false },
								},
								{
									key: "request",
									kind: "object-property",
									span: [885, 965],
									value: {
										kind: "string",
										span: [896, 965],
										tokens: [
											"HEAD / HTTP/1.1",
											"Host: storage.googleapis.com",
											"Connection: close",
										],
									},
								},
								{
									key: "expected_response",
									kind: "object-property",
									span: [971, 995],
									value: { kind: "integer", span: [992, 995], value: 200n },
								},
								{
									key: "interval",
									kind: "object-property",
									span: [1001, 1016],
									value: {
										kind: "rtime",
										value: 60n,
										unit: "s",
										span: [1013, 1016],
									},
								},
								{
									key: "timeout",
									kind: "object-property",
									span: [1049, 1062],
									value: {
										kind: "rtime",
										value: 2n,
										unit: "s",
										span: [1060, 1062],
									},
								},
								{
									key: "window",
									kind: "object-property",
									span: [1129, 1140],
									value: { kind: "integer", span: [1139, 1140], value: 5n },
								},
								{
									key: "initial",
									kind: "object-property",
									span: [1181, 1193],
									value: { kind: "integer", span: [1192, 1193], value: 4n },
								},
								{
									key: "threshold",
									kind: "object-property",
									span: [1252, 1266],
									value: { kind: "integer", span: [1265, 1266], value: 4n },
								},
							],
							span: [674, 1344],
						},
					},
				],
				span: [0, 1346],
			},
		],
		span: [0, 1346],
	});
	assert.deepEqual(parser.comments, [
		"# Required to be set for all VCL defined backends",
		"# Server location",
		"# Timeouts and limits",
		"# Host header override",
		"# Protected properties",
		"# Health check",
		"# Boolean value determines the behavior of the probe.",
		"# `true` performs DNS lookups only.",
		"# `false` performs DNS lookups and HTTP health checks.",
		"# Send a check every 60s",
		"# Allow up to 2s for the backend to respond to the check",
		"# Keep a history of 5 checks",
		"# Start with 4 successful checks in the history",
		"# 4 of the recent checks must be successful for backend to be healthy",
	]);
});

test("Director", () => {
	const source = `director the_hash_dir hash {
  .quorum=20%;
  { .backend=F_origin_0; .weight=1; }
  { .backend=F_origin_1; .weight=1; }
  { .backend=F_origin_2; .weight=1; }
}`;
	const parser = createParser(source);
	assert.deepEqual(parser.parse(), {
		kind: "vcl",
		declarations: [
			{
				directions: [
					{
						kind: "object",
						properties: [
							{
								key: "backend",
								kind: "object-property",
								span: [48, 67],
								value: {
									kind: "variable",
									name: "F_origin_0",
									properties: [],
									span: [57, 67],
									subField: undefined,
								},
							},
							{
								key: "weight",
								kind: "object-property",
								span: [69, 78],
								value: { kind: "integer", span: [77, 78], value: 1n },
							},
						],
						span: [46, 81],
					},
					{
						kind: "object",
						properties: [
							{
								key: "backend",
								kind: "object-property",
								span: [86, 105],
								value: {
									kind: "variable",
									name: "F_origin_1",
									properties: [],
									span: [95, 105],
									subField: undefined,
								},
							},
							{
								key: "weight",
								kind: "object-property",
								span: [107, 116],
								value: { kind: "integer", span: [115, 116], value: 1n },
							},
						],
						span: [84, 119],
					},
					{
						kind: "object",
						properties: [
							{
								key: "backend",
								kind: "object-property",
								span: [124, 143],
								value: {
									kind: "variable",
									name: "F_origin_2",
									properties: [],
									span: [133, 143],
									subField: undefined,
								},
							},
							{
								key: "weight",
								kind: "object-property",
								span: [145, 154],
								value: { kind: "integer", span: [153, 154], value: 1n },
							},
						],
						span: [122, 157],
					},
				],
				kind: "director",
				name: "the_hash_dir",
				properties: [
					{
						key: "quorum",
						kind: "object-property",
						span: [31, 42],
						value: { kind: "parcent", span: [39, 42], value: 20n },
					},
				],
				span: [0, 159],
				type: "content",
			},
		],
		span: [0, 159],
	});
});

test("Penaltybox", () => {
	const source = `penaltybox banned_users {
  # no properties
}`;
	const parser = createParser(source);
	assert.deepEqual(parser.parse(), {
		kind: "vcl",
		declarations: [
			{
				kind: "penaltybox",
				name: "banned_users",
				span: [0, 45],
			},
		],
		span: [0, 45],
	});
	assert.deepEqual(parser.comments, ["# no properties"]);
});

test("Ratecounter", () => {
	const source = `ratecounter requests_rate {
  # no properties
}`;
	const parser = createParser(source);
	assert.deepEqual(parser.parse(), {
		kind: "vcl",
		declarations: [
			{
				kind: "ratecounter",
				name: "requests_rate",
				span: [0, 47],
			},
		],
		span: [0, 47],
	});
	assert.deepEqual(parser.comments, ["# no properties"]);
});

// TODO: handle subroutine
test("Subroutine", () => {
	const source = `sub vcl_recv {
  # Requests for /status and all subpaths => origin 0
  # (query strings allowed)
  if (req.url ~ "^/status(/[^?]*)?(\?.*)?$") {
    set req.backend = F_origin_0;

  # Requests for exactly / => origin 1
  # (query strings not allowed)
  } else if (req.url == "/") {
    set req.backend = F_origin_1;

  # Unrecognised path => synthethic 404 error
  } else {
    error 601;
  }
}`;
	const parser = createParser(source);
	assert.deepEqual(parser.parse(), {
		kind: "vcl",
		declarations: [
			{
				body: [
					{
						body: [
							{
								kind: "set",
								operator: { kind: "=", span: [163, 164] },
								span: [147, 176],
								target: {
									kind: "variable",
									name: "req",
									properties: ["backend"],
									span: [151, 162],
									subField: undefined,
								},
								value: {
									kind: "variable",
									name: "F_origin_0",
									properties: [],
									span: [165, 175],
									subField: undefined,
								},
							},
						],
						condition: {
							kind: "binary",
							lhs: {
								kind: "variable",
								name: "req",
								properties: ["url"],
								span: [103, 110],
								subField: undefined,
							},
							operator: { kind: "~", span: [111, 112] },
							rhs: {
								kind: "string",
								span: [113, 139],
								tokens: ["^/status(/[^?]*)?(?.*)?$"],
							},
							span: [103, 139],
						},
						else: {
							body: [
								{
									kind: "set",
									operator: { kind: "=", span: [300, 301] },
									span: [284, 313],
									target: {
										kind: "variable",
										name: "req",
										properties: ["backend"],
										span: [288, 299],
										subField: undefined,
									},
									value: {
										kind: "variable",
										name: "F_origin_1",
										properties: [],
										span: [302, 312],
										subField: undefined,
									},
								},
							],
							condition: {
								kind: "binary",
								lhs: {
									kind: "variable",
									name: "req",
									properties: ["url"],
									span: [262, 269],
									subField: undefined,
								},
								operator: { kind: "==", span: [270, 272] },
								rhs: { kind: "string", span: [273, 276], tokens: ["/"] },
								span: [262, 276],
							},
							else: {
								body: [
									{
										kind: "error",
										message: undefined,
										span: [376, 386],
										status: 601,
									},
								],
								kind: "else",
								span: [370, 390],
							},
							kind: "if",
							span: [258, 390],
						},
						kind: "if",
						span: [99, 390],
					},
				],
				kind: "sub",
				name: "vcl_recv",
				returnType: undefined,
				span: [13, 392],
			},
		],
		span: [0, 392],
	});
});

test("Table", () => {
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
	assert.deepEqual(parser.parse(), {
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
	});
});
