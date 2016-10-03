(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

$(document).ready(function () {
    var ws = new WebSocket("ws://localhost:8888/ws");
    ws.onopen = function (evt) {
        var conn_status = document.getElementById('conn_text');
        conn_status.innerHTML = "CONNECTED!";
    };
    ws.onmessage = function (evt) {
        var data = JSON.parse(evt.data);
        var newMessage = document.createElement('li');
        newMessage.className = "list-group-item";
        if (data.text) {
            var text = data.text.toLowerCase();
            newMessage.textContent = data.text.toLowerCase();
            if (text.indexOf("bank") !== -1) {
                document.getElementById('messages_txt').appendChild(newMessage);
            }
        }
    };
    ws.onclose = function (evt) {
        var conn_status = document.getElementById('conn_text');
        conn_status.innerHTML = "DISCONNECTED!";
    };
});

},{}]},{},[1]);
