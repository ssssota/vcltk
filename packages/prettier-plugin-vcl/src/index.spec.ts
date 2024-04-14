import { format } from "prettier";
import { expect, it } from "vitest";
import { plugin } from "./index.js";

function formatVcl(source: string) {
	return format(source, {
		plugins: [plugin],
		parser: "fastly-vcl",
	});
}

it("should format ACL declaration", async () => {
	const source = `acl office_ip_ranges {
  "192.0.2.0" / 24; // office network
  !"192.0.2.12" ;
"198.51.100.4";
      "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff";
  }

`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"acl office_ip_ranges {
		  "192.0.2.0"/24; // office network
		  ! "192.0.2.12";
		  "198.51.100.4";
		  "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff";
		}
		"
	`);
});

it("should format Penaltybox/Ratecounter declaration", async () => {
	const source = `penaltybox banned_users {
  }ratecounter requests_per_second {
}`;
	const expected = `penaltybox banned_users {}

ratecounter requests_per_second {}
`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"penaltybox banned_users {}
		ratecounter requests_per_second {}
		"
	`);
});

it("should format backend declaration", async () => {
	const source = `backend F_backend {
  . host = "storage.googleapis.com";
  .port="443" ;
  .ssl
  =
true;
}`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"backend F_backend {
		  .host = "storage.googleapis.com";
		  .port = "443";
		  .ssl = true;
		}
		"
	`);
});

it("should format director declaration", async () => {
	const source = `director round_robin_director client{
  { .backend = F_backend; .weight = 1; }
  }`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"director round_robin_director client {
		  { .backend = F_backend; .weight = 1; }
		}
		"
	`);
});

it("should format table declarations", async () => {
	const source = `table redirects {
    "/old/path" : "https://other.hostname/new/path",
    "/another/path"
    :
    "/new/path"
    }
    table routing_table BACKEND { "a.example.com" : b0,
"b.example.com"
:b1,"c.example.com":b2}`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"table redirects {
		  "/old/path": "https://other.hostname/new/path",
		  "/another/path": "/new/path",
		}
		table routing_table BACKEND {
		  "a.example.com": b0,
		  "b.example.com": b1,
		  "c.example.com": b2,
		}
		"
	`);
});

it("should format import declaration", async () => {
	const source = "import  std ;";
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"import std;
		"
	`);
});

it("should format include declaration", async () => {
	const source = `include  "std/lib.vcl" ;`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"include "std/lib.vcl";
		"
	`);
});

it("should format variable declaration", async () => {
	const source = `backend backend_name {
  .dynamic = true;
.share_key = "YOUR_SERVICE_ID";

.host="storage.googleapis.com";
    .port="443";
.ssl=
true;

 .between_bytes_timeout = 10s;
.connect_timeout =1s;
.
first_byte_timeout = 15s;
. max_connections = 200  ;
}
 `;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"backend backend_name {
		  .dynamic = true;
		  .share_key = "YOUR_SERVICE_ID";
		  .host = "storage.googleapis.com";
		  .port = "443";
		  .ssl = true;
		  .between_bytes_timeout = 10s;
		  .connect_timeout = 1s;
		  .first_byte_timeout = 15s;
		  .max_connections = 200;
		}
		"
	`);
});

it("should format subroutine declaration", async () => {
	const source = `sub vcl_recv {
#FASTLY recv
set req.http.X-Forwarded-For = client.ip;
if(table.contains(deny_list, client.ip)){ error 403 "Forbidden"
;
 goto test; }return ( lookup );

if(req.http.Location~"^/admin"&&(req.http.Cookie!~"admin")||req.http.Location~"^/admin"&&req.http.Cookie!~
"admin"){
synthetic {"Hello, admin! Please log in."} ;
  }test:
}
sub test {}

sub test2 STRING{

}
sub vcl_deliver {
	#FASTLY deliver
}`;
	await expect(formatVcl(source)).resolves.toMatchInlineSnapshot(`
		"sub vcl_recv {
		  #FASTLY recv
		  set req.http.X-Forwarded-For = client.ip;
		  if (table.contains(deny_list, client.ip)) {
		    error 403 "Forbidden";
		    goto test;
		  }
		  return(lookup);

		  if (
		    req.http.Location ~ "^/admin" && (req.http.Cookie !~ "admin") ||
		    req.http.Location ~ "^/admin" && req.http.Cookie !~ "admin"
		  ) {
		    synthetic {"Hello, admin! Please log in."};
		  }
		  test:
		}
		sub test {
		}

		sub test2 STRING {
		}
		sub vcl_deliver {
		  #FASTLY deliver
		}
		"
	`);
});
