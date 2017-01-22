Companionate
============

Companionate allows you to solve the problem of logging into a machine
you don't have your password manager authenticated on by letting you
enter the details on a device with the password manager on, and then
use QR codes to transfer the information

How to use
----------

1. Load "Make code" page on your device with the password manager and enter the login.
2. Load "Use code" page on the other machine, and scan in the QR code from your device

Running your own
----------------

It's a Single Page App, and all the current dependencies are installed,
but you'll need an HTTPS server to make it work (because of webcam data
limitations). Easiest way to get one of those is:

1. Install OpenSSL and Python (via your package manager of choice)
2. `openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes`
3. `python https-server.py`
4. Open https://localhost:4443

Developing
----------

I've copied various of the dependencies manually in, but you should
have a full install for local dev.

1. Install [Node and npm](https://docs.npmjs.com/getting-started/installing-node)
2. `npm install`
3. `rm -Rf bower_components` (to get rid of the manually added items)
3. `./node_modules/.bin/bower install`

If you add new components with Bower, don't forget to add the needed
parts for standalone running explicitly with `git add -f`.

FAQ
---

* What if I don't have a webcam on the "other machine"? - Well, then this won't work. Major target was shared machines in a meeting room being used to demo things, and many of those get used for video conferencing these days, so webcams are quite common.
* Is this secure? - Somewhat, not drastically. So, the Javascript as
written (and feel free to check this yourself) doesn't share any of the
info you've input with any other machines. There might be for example a
backdoor in the QR code scanning library, or just simply an issue with
the Javascript engine that makes it leak information. A more likely
scenario is that the machine you were logging into has been compromised
in some way, but that's up to you to confirm, and if you were intending
on logging onto a service on that machine, you should generally be
reasonably certain it's not been taken over, which has nothing to do
with this software!