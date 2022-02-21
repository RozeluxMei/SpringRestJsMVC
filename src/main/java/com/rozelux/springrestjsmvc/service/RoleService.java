package com.rozelux.springrestjsmvc.service;


import com.rozelux.springrestjsmvc.model.Role;

import java.util.List;

public interface RoleService {
    void add(Role role);
    List<Role> findAllRoles();
    void remove(long id);
    void update (Role role);
    Role getRole (long id);
    Role getRoleByName (String role);
}
