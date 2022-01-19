package com.rozelux.springbootmvc.service;


import com.rozelux.springbootmvc.model.Role;

import java.util.List;

public interface RoleService {
    void add(Role role);
    List<Role> listRole();
    void remove(long id);
    void update (Role role);
    Role getRole (long id);
    Role getRoleByName (String role);
}
