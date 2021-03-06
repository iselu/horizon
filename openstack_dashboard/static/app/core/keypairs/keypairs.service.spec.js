/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  describe('horizon.app.core.keypairs', function () {
    it('should exist', function () {
      expect(angular.module('horizon.app.core.keypairs')).toBeDefined();
    });
  });

  describe('keypairsService', function() {
    var service;
    beforeEach(module('horizon.app.core'));
    beforeEach(inject(function($injector) {
      service = $injector.get('horizon.app.core.keypairs.service');
    }));

    describe('getKeypairsPromise', function() {
      it("provides a promise that gets translated", inject(function($q, $injector, $timeout) {
        var nova = $injector.get('horizon.app.core.openstack-service-api.nova');
        var session = $injector.get('horizon.app.core.openstack-service-api.userSession');
        var deferred = $q.defer();
        var deferredSession = $q.defer();
        spyOn(nova, 'getKeypairs').and.returnValue(deferred.promise);
        spyOn(session, 'get').and.returnValue(deferredSession.promise);
        var result = service.getKeypairsPromise({});
        deferredSession.resolve({});
        deferred.resolve({
          data: {
            items: [{keypair: {name: 'keypair1'}}]
          }
        });
        $timeout.flush();
        expect(nova.getKeypairs).toHaveBeenCalled();
        expect(result.$$state.value.data.items[0].name).toBe('keypair1');
        expect(result.$$state.value.data.items[0].trackBy).toBe('keypair1');
      }));
    });

  });

})();
