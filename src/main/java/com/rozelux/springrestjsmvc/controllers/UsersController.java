package com.rozelux.springrestjsmvc.controllers;

import com.rozelux.springrestjsmvc.model.Role;
import com.rozelux.springrestjsmvc.model.User;
import com.rozelux.springrestjsmvc.service.RoleService;
import com.rozelux.springrestjsmvc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@Controller

public class UsersController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UsersController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/")
    public String index (@AuthenticationPrincipal User user, Model model){
        model.addAttribute("logged_user", user);
        model.addAttribute("new_user", new User());
        model.addAttribute( "users", userService.findAllUsers());
        model.addAttribute("roles", roleService.findAllRoles());
        return "pages/index";
    }
}
