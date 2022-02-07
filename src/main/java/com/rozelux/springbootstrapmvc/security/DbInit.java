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

    @Autowired
    RoleRepository roleRepository;

    @PostConstruct
    private void postConstruct(){
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");
        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        User admin = new User("admin","admin","admin@mail.ru", 35, "admin");
        HashSet<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminRoles.add(userRole);
        admin.setRoles(adminRoles);

        userRepository.save(admin);

        User user = new User("user", "user", "user@mail.ru", 30, "user");
        HashSet<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        user.setRoles(userRoles);

        userRepository.save(user);
    }
}
