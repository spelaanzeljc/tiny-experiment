# State management

This project uses Zustand for state management. While Zustand is not the most sophisticated state management system out there, it is simple to use and in most projects enough, because the bulk of the state is stored in TanStack Query.

## Creating a new store

A store slice should be created under the domain folder inside the `modules/[domain]/stores`. For each domain, you are encouraged to create as many small stores as you need. Make sure to properly type them and only export the hooks from the namespace.

### When not to create a store

Don't create a store for storing server data. For this, TanStack Query should be used.

## Template instructions

It might be tempting to introduce a more complex state management solution into your project. However, we strongly suggest you stick with Zustand, unless you have a specific reason not to. Zustand is simple, performant, and easy to use. If you still think another solution would be better for your particular project, please consult with your architect.
