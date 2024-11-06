//
// Created by panca on 11/6/24.
//

#ifndef CHAT_TYPES_H
#define CHAT_TYPES_H

#include <string>
#include <map>
#include <mutex>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>

namespace beast = boost::beast;
namespace websocket = boost::websocket;
namespace net = boost::asio;
using tcp = boost::asio::ip::tcp;

namespace App {

    struct ChatClient {
      std::string username;
      std::shared_ptr<websocket::stream<tcp::socket>> ws;
    };

    struct ChatServer {
        std::map<std::string, ChatClient> clients;
        std::mutex clientMutex;
    };
} // namespace App

#endif //CHAT_TYPES_H

