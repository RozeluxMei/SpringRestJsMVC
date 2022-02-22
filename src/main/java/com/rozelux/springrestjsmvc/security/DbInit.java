package com.rozelux.springrestjsmvc.security;

import com.rozelux.springrestjsmvc.DAO.RoleRepository;
import com.rozelux.springrestjsmvc.DAO.UserRepository;
import com.rozelux.springrestjsmvc.model.Role;
import com.rozelux.springrestjsmvc.model.User;
import com.rozelux.springrestjsmvc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class DbInit {

    @Autowired
    UserService userService;
    @Autowired
    RoleRepository roleRepository;

    @PostConstruct
    private void postConstruct(){


        User admin = new User("admin","admin","admin@mail.ru", 35, "admin");
        HashSet<Role> adminRoles = new HashSet<>();
        adminRoles.add(roleRepository.save(new Role("ROLE_ADMIN")));
        adminRoles.add(roleRepository.save(new Role("ROLE_USER")));
        admin.setRoles(adminRoles);

        userService.add(admin);

        User user = new User("user", "user", "user@mail.ru", 30, "user");
        HashSet<Role> userRoles = new HashSet<>();
        userRoles.add(roleRepository.findRoleByRole("ROLE_USER"));
        user.setRoles(userRoles);

        userService.add(user);
    }
}
