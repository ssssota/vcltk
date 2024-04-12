import { tokenize } from "@vcltk/tokenizer";
import { expect, test } from "vitest";
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
	expect(parser.parse()).toMatchSnapshot();
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
	expect(parser.parse()).toMatchSnapshot();
});

test("Director", () => {
	const source = `director the_hash_dir hash {
  .quorum=20%;
  { .backend=F_origin_0; .weight=1; }
  { .backend=F_origin_1; .weight=1; }
  { .backend=F_origin_2; .weight=1; }
}`;
	const parser = createParser(source);
	expect(parser.parse()).toMatchSnapshot();
});

test("Penaltybox", () => {
	const source = `penaltybox banned_users {
  # no properties
}`;
	const parser = createParser(source);
	expect(parser.parse()).toMatchSnapshot();
});

test("Ratecounter", () => {
	const source = `ratecounter requests_rate {
  # no properties
}`;
	const parser = createParser(source);
	expect(parser.parse()).toMatchSnapshot();
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
	expect(parser.parse()).toMatchSnapshot();
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
	expect(parser.parse()).toMatchSnapshot();
});
