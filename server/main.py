import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

import twitter
import threading


from time import sleep
from k import CONSUMER_KEY,CONSUMER_SECRET,ACCESS_TOKEN_KEY,ACCESS_TOKEN_SECRET

api = twitter.Api(
    consumer_key = CONSUMER_KEY,
    consumer_secret = CONSUMER_SECRET,
    access_token_key = ACCESS_TOKEN_KEY,
    access_token_secret = ACCESS_TOKEN_SECRET            
)


class Twitterer():
    def __init__(self):
        self.clients = set()

    def add_client(self, client):
        self.clients.add(client)

    def remove_client(self, client):
        self.clients.discard(client)

    def go(self):
        while True:
            if self.clients:
                for line in api.GetStreamFilter(track=['bank']):
                    for c in self.clients:
                        print "sending to client"
                        c.write_message(
                            line
                        )
                    sleep(0.5)
            else:
                sleep(1)

twitterer = Twitterer()

class WSHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print 'user is connected.\n'
        twitterer.add_client(self)
        # Twitterer().go(self)

    def on_message(self, message):
        print 'received message: %s\n' %message
        self.write_message(message + ' OK')

    def on_close(self):
        print 'connection closed\n'
        twitterer.remove_client(self)

application = tornado.web.Application([(r'/ws', WSHandler),])

if __name__ == "__main__":
    worker = threading.Thread(target=twitterer.go, args=())
    worker.daemon = True
    worker.start()
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()