package com.rozelux.springbootmvc.service;

import com.rozelux.springbootmvc.model.User;
import java.util.List;

public interface UserService {
    void add(User user);
    List<User> listUsers();
    void remove(long id);
    void update (User user);
    User getUser (long id);
}
