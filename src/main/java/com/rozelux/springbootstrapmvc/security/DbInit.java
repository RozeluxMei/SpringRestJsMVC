package com.rozelux.springbootstrapmvc.security;

import com.rozelux.springbootstrapmvc.DAO.RoleRepository;
import com.rozelux.springbootstrapmvc.DAO.UserRepository;
import com.rozelux.springbootstrapmvc.model.Role;
import com.rozelux.springbootstrapmvc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;

@Component
public class DbInit {

    @Autowired
    UserRepository userRepository;

    @PostConstruct
    private void postConstruct(){
        User admin = new User("admin","admin","admin@mail.ru", 35, "admin");
        HashSet<Role> adminRoles = new HashSet<>();
        adminRoles.add(new Role("ROLE_USER"));
        adminRoles.add(new Role("ROLE_ADMIN"));
        admin.setRoles(adminRoles);

        User user = new User("user", "user", "user@mail.ru", 30, "user");
        HashSet<Role> userRoles = new HashSet<>();
        userRoles.add(new Role("ROLE_ADMIN"));
        user.setRoles(userRoles);

        userRepository.save(admin);
        userRepository.save(user);
    }
}
