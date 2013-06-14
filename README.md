nerdeez-ember
=============

Common ember scripts that are common across different applications

## wormhole.js

Wormhole - it bridges time and space. 
Enables ember to do cross domain communication. 
let's say you have a rest server in this url: www.foo.com
and let's say that you have you client app running in this url: www.bar.com
we want to ajax communicate between these two domain but alas we have the same origin problem,
ajax can't communicate across different domains, OK no worries thank god we have jsonp.
using jsonp we can make the browser think we are passing javascript and instead pass data.
Oh but fuck my life what if i want to do a post, delete, put requests like we love to do with a rest server,
Jsonp only support get requests!!!!!
no worries there is porthole.js and this script which i made which uses porthole to create ember support for cross domain communications. 

#### Installation

<script src="{{PATH TO vendor}}/jquery.js"></script>
<script src="{{PATH TO nerdeez-ember}}/porthole.js"></script>
<script src="{{PATH TO nerdeez-ember}}/wormhole.js"></script>

#### Usage

