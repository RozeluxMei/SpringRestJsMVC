package com.rozelux.springrestjsmvc.service;

import com.rozelux.springrestjsmvc.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    void add(User user);
    List<User> findAllUsers();
    void remove(long id);
    void update (User user);
    User getUser (long id);
}
