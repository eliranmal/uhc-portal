const mockGetUsersPayload = {
  data: {
    kind: 'GroupList',
    href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups',
    page: 1,
    size: 1,
    total: 1,
    items: [
      {
        kind: 'Group',
        href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins',
        id: 'dedicated-admins',
        users: {
          kind: 'UserList',
          href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users',
          items: [
            {
              kind: 'User',
              href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users/u1',
              id: 'u1',
            },
            {
              kind: 'User',
              href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users/u2',
              id: 'u2',
            },
          ],
        },
      },
      {
        kind: 'Group',
        href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins',
        id: 'cluster-admins',
        users: {
          kind: 'UserList',
          href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users',
          items: [
            {
              kind: 'User',
              href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users/u2',
              id: 'u2',
            },
            {
              kind: 'User',
              href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users/u3',
              id: 'u3',
            },
          ],
        },
      },
    ],
  },
};

const users = [
  {
    group: 'dedicated-admins',
    href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users/u1',
    id: 'u1',
    kind: 'User',
  },
  {
    group: 'dedicated-admins',
    href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users/u2',
    id: 'u2',
    kind: 'User',
  },
  {
    group: 'cluster-admins',
    href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users/u2',
    id: 'u3',
    kind: 'User',
  },
  {
    group: 'cluster-admins',
    href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users/u3',
    id: 'u4',
    kind: 'User',
  },
];

const stateWithUsers = {
  groupUsers: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: true,
    clusterID: undefined,
    users,
  },
};

export { mockGetUsersPayload, stateWithUsers, users };
