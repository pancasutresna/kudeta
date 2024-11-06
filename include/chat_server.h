//
// Created by panca on 11/6/24.
//

#ifndef CHAT_SERVER_H
#define CHAT_SERVER_H

#include "chat_types.h"

namespace App {

    class ChatServerHandler {
      public:
        static ChatServer& GetInstance();
        static void BroadcastMessage(const std::string& sender, const std::string& message);
        static void HandleWebSocketSession(std::shared_ptr<websocket::stream<tcp::socket>> ws);

       private:
         static ChatServer chatServer;
    };
} // namespace App

#endif //CHAT_SERVER_H
